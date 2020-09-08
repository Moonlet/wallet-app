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
import { ApiClient } from '../../utils/api-client/api-client';
import BigNumber from 'bignumber.js';
import { INearTransactionAdditionalInfoType, NearTransactionActionType } from './types';

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
                        return functionCall(...tx.additionalInfo.actions[0].params);

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
        const client = Near.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE: {
                const splitAmount = new BigNumber(tx.amount).dividedBy(tx.validators.length);

                for (const validator of tx.validators) {
                    const txDelegate: IPosTransaction = cloneDeep(tx);
                    txDelegate.amount = splitAmount.toFixed();

                    const res = await new ApiClient().validators.getBalance(
                        tx.account,
                        client.chainId.toString()
                    );

                    if (
                        new BigNumber(txDelegate.amount).isGreaterThan(
                            new BigNumber(res.balance.unstaked)
                        )
                    ) {
                        const depositAmount = new BigNumber(txDelegate.amount).minus(
                            new BigNumber(res.balance.unstaked)
                        );

                        // Deposit
                        const depositTx: IBlockchainTransaction = await (client as NearClient).stakingPool.deposit(
                            txDelegate,
                            validator
                        );

                        depositTx.nonce = depositTx.nonce + transactions.length;
                        depositTx.amount = depositAmount.toFixed();
                        transactions.push(depositTx);
                    } else {
                        // no need to deposit
                    }

                    // Stake
                    const stakeTx: IBlockchainTransaction = await (client as NearClient).stakingPool.stake(
                        txDelegate,
                        validator
                    );
                    stakeTx.nonce = stakeTx.nonce + transactions.length;
                    transactions.push(stakeTx);
                }
                break;
            }
            case PosBasicActionType.UNSTAKE: {
                const txUnstake: IPosTransaction = cloneDeep(tx);

                // Unstake
                const unstakeTx: IBlockchainTransaction = await (client as NearClient).stakingPool.unstake(
                    txUnstake,
                    tx.validators[0]
                );
                transactions.push(unstakeTx);
                break;
            }
            case PosBasicActionType.WITHDRAW: {
                const txWithdraw: IPosTransaction = cloneDeep(tx);

                // Withdraw
                const withdrawTx: IBlockchainTransaction = await (client as NearClient).stakingPool.withdraw(
                    txWithdraw
                );

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
        if (status.SuccessValue === '') {
            return TransactionStatus.SUCCESS;
        } else if (status?.Failure) {
            return TransactionStatus.FAILED;
        } else {
            return TransactionStatus.FAILED;
        }
    }
}
