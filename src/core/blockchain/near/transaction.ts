import {
    IBlockchainTransaction,
    ITransferTransaction,
    TransactionType,
    AbstractBlockchainTransactionUtils,
    IPosTransaction
} from '../types';
import { Near } from './';
import { TransactionStatus } from '../../wallet/types';
import {
    transfer,
    createTransaction,
    signTransaction,
    functionCall
} from 'near-api-js/lib/transaction';
import { KeyPair, PublicKey } from 'near-api-js/lib/utils/key_pair';
import { base_decode } from 'near-api-js/lib/utils/serialize';
import BN from 'bn.js';
import sha256 from 'js-sha256';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { PosBasicActionType } from '../types/token';
import { Client as NearClient } from './client';
import cloneDeep from 'lodash/cloneDeep';
import BigNumber from 'bignumber.js';
import {
    INearTransactionAdditionalInfoType,
    NearAccountViewMethods,
    NearFunctionCallMethods,
    NearTransactionActionType
} from './types';
import { AccountType, IAccountState } from '../../../redux/wallets/state';
import { NEAR_TLD } from '../../constants/app';
import { NEAR_DEFAULT_FUNC_CALL_GAS, NEAR_CREATE_ACCOUNT_MIN_BALANCE } from './consts';

export class NearTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(
        tx: IBlockchainTransaction<INearTransactionAdditionalInfoType>,
        privateKey: string
    ): Promise<any> {
        // transaction actions
        const actions = tx.additionalInfo.actions
            .map(action => {
                switch (action.type) {
                    case NearTransactionActionType.TRANSFER:
                        return transfer(new BN(tx.amount));

                    case NearTransactionActionType.FUNCTION_CALL:
                        // @ts-ignore
                        return functionCall(...action.params);

                    default:
                        return false;
                }
            })
            .filter(Boolean);

        // setup KeyPair
        const keyPair = KeyPair.fromString(privateKey);

        // create transaction
        const nearTx = createTransaction(
            tx.address,
            PublicKey.fromString(tx.publicKey),
            tx.toAddress,
            tx.nonce,
            actions as any,
            base_decode(tx.additionalInfo.currentBlockHash)
        );

        // sign transaction
        const signer: any = {
            async signMessage(message) {
                const hash = new Uint8Array(sha256.sha256.array(message));
                return keyPair.sign(hash);
            },
            async getPublicKey() {
                return keyPair.getPublicKey();
            }
        };

        const signedTx = await signTransaction(nearTx, signer, tx.address, tx.chainId as string);

        return Buffer.from(signedTx[1].encode()).toString('base64');
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const client = Near.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
        const blockInfo = await client.getCurrentBlock();

        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

        return {
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: tx.account.blockchain,
            chainId: tx.chainId,
            type: TransactionType.TRANSFER,
            token: tokenConfig,

            address: tx.account.address,
            publicKey: tx.account.publicKey,

            toAddress: tx.toAddress,
            amount: tx.amount,
            feeOptions: tx.feeOptions,
            broadcastedOnBlock: undefined,
            nonce,
            status: TransactionStatus.PENDING,
            additionalInfo: {
                currentBlockHash: blockInfo.hash,
                actions: [
                    {
                        type: NearTransactionActionType.TRANSFER
                    }
                ]
            }
        };
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Near.getClient(tx.chainId) as NearClient;
        const accountType = tx.account.type;

        const transactions: IBlockchainTransaction[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE: {
                const splitAmount = new BigNumber(tx.amount).dividedBy(tx.validators.length);

                const txDelegate: IPosTransaction = cloneDeep(tx);
                txDelegate.amount = splitAmount.toFixed();

                if (accountType === AccountType.DEFAULT) {
                    // DEFAULT
                    for (const validator of tx.validators) {
                        let depositAmount = new BigNumber(0);
                        try {
                            const unstaked = await client.contractCall({
                                contractName: validator.id,
                                methodName: NearAccountViewMethods.GET_ACCOUNT_UNSTAKED_BALANCE,
                                args: { account_id: tx.account.address }
                            });
                            depositAmount = new BigNumber(txDelegate.amount).minus(
                                new BigNumber(unstaked)
                            );
                        } catch (err) {
                            // no need to handle this
                            // maybe sentry?
                        }

                        // Stake
                        const stakeTx: IBlockchainTransaction = await client.stakingPool.stake(
                            txDelegate,
                            validator,
                            depositAmount
                        );
                        stakeTx.nonce = stakeTx.nonce + transactions.length;
                        transactions.push(stakeTx);
                    }
                } else if (accountType === AccountType.LOCKUP_CONTRACT) {
                    // LOCKUP_CONTRACT

                    const validator = tx.validators[0]; // Can stake to only 1 validator
                    const nonce = await client.getNonce(
                        tx.account.meta.owner,
                        tx.account.publicKey
                    );

                    try {
                        const stakingPoolId = await client.contractCall({
                            contractName: tx.account.address,
                            methodName: NearAccountViewMethods.GET_STAKING_POOL_ACCOUNT_ID
                        });

                        if (!stakingPoolId) {
                            const selectSPTx = await client.lockup.selectStakingPool(
                                txDelegate,
                                validator
                            );
                            selectSPTx.nonce = nonce + transactions.length;
                            transactions.push(selectSPTx);
                        }
                    } catch (err) {
                        // no need to handed?
                    }

                    let unstakedAmount = new BigNumber(0);
                    try {
                        const unstaked = await client.contractCall({
                            contractName: validator.id,
                            methodName: NearAccountViewMethods.GET_ACCOUNT_UNSTAKED_BALANCE,
                            args: { account_id: tx.account.address }
                        });
                        unstakedAmount = new BigNumber(unstaked);
                    } catch (err) {
                        // no need to handle this
                        // maybe sentry?
                    }

                    const stakeTx = await client.lockup.stake(
                        txDelegate,
                        validator,
                        unstakedAmount
                    );
                    stakeTx.nonce = nonce + transactions.length;
                    transactions.push(stakeTx);
                } else {
                    // future account types
                }

                break;
            }
            case PosBasicActionType.UNSTAKE: {
                const txUnstake: IPosTransaction = cloneDeep(tx);

                // Unstake
                let unstakeTx: IBlockchainTransaction;

                if (accountType === AccountType.DEFAULT) {
                    // DEFAULT
                    unstakeTx = await client.stakingPool.unstake(txUnstake, tx.validators[0]);
                } else if (accountType === AccountType.LOCKUP_CONTRACT) {
                    // LOCKUP_CONTRACT
                    unstakeTx = await client.lockup.unstake(txUnstake, tx.validators[0]);
                    const nonce = await client.getNonce(unstakeTx.address, tx.account.publicKey);
                    unstakeTx.nonce = nonce;
                } else {
                    // future account types
                }

                transactions.push(unstakeTx);
                break;
            }
            case PosBasicActionType.WITHDRAW: {
                const txWithdraw: IPosTransaction = cloneDeep(tx);

                // Withdraw
                let withdrawTx: IBlockchainTransaction;

                if (accountType === AccountType.DEFAULT) {
                    // DEFAULT
                    withdrawTx = await client.stakingPool.withdraw(txWithdraw);
                } else {
                    // future account types
                }

                transactions.push(withdrawTx);
                break;
            }

            default:
                break;
        }

        return transactions;
    }

    public getTransactionAmount(tx: IBlockchainTransaction): string {
        return tx.amount;
    }

    public getTransactionStatusByCode(status: any): TransactionStatus {
        if (status?.SuccessValue || status?.SuccessValue === '') {
            return TransactionStatus.SUCCESS;
        } else {
            return TransactionStatus.FAILED;
        }
    }

    public async buildDropLinkTransaction(tx: {
        account: IAccountState;
        newPublicKey: string;
        tokenSymbol: string;
        chainId: string;
    }) {
        const client = Near.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
        const blockInfo = await client.getCurrentBlock();

        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.tokenSymbol);

        return {
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: tx.account.blockchain,
            chainId: tx.chainId,
            type: TransactionType.TRANSFER,
            token: tokenConfig,

            address: tx.account.address,
            publicKey: tx.account.publicKey,

            toAddress: NEAR_TLD[tx.chainId],
            amount: '0',
            feeOptions: undefined,
            broadcastedOnBlock: undefined,
            nonce,
            status: TransactionStatus.PENDING,
            additionalInfo: {
                currentBlockHash: blockInfo.hash,
                actions: [
                    {
                        type: NearTransactionActionType.FUNCTION_CALL,
                        params: [
                            NearFunctionCallMethods.SEND,
                            { public_key: tx.newPublicKey },
                            NEAR_DEFAULT_FUNC_CALL_GAS,
                            NEAR_CREATE_ACCOUNT_MIN_BALANCE
                        ]
                    }
                ],
                posAction: PosBasicActionType.SEND
            }
        };
    }

    public async buildClaimAccountTransaction(tx: {
        account: IAccountState;
        newAccountId: string;
        newPublicKey: string;
        tokenSymbol: string;
        chainId: string;
    }) {
        const client = Near.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
        const blockInfo = await client.getCurrentBlock();

        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.tokenSymbol);

        return {
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: tx.account.blockchain,
            chainId: tx.chainId,
            type: TransactionType.TRANSFER,
            token: tokenConfig,

            address: NEAR_TLD[tx.chainId],
            publicKey: tx.account.publicKey,

            toAddress: NEAR_TLD[tx.chainId],
            amount: '0',
            feeOptions: undefined,
            broadcastedOnBlock: undefined,
            nonce,
            status: TransactionStatus.PENDING,
            additionalInfo: {
                currentBlockHash: blockInfo.hash,
                actions: [
                    {
                        type: NearTransactionActionType.FUNCTION_CALL,
                        params: [
                            NearFunctionCallMethods.CREATE_ACCOUNT_AND_CLAIM,
                            {
                                new_account_id: tx.newAccountId,
                                new_public_key: tx.newPublicKey
                            },
                            NEAR_DEFAULT_FUNC_CALL_GAS,
                            new BN(0)
                        ]
                    }
                ],
                posAction: PosBasicActionType.CREATE_ACCOUNT_AND_CLAIM
            }
        };
    }
}
