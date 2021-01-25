import {
    IBlockchainTransaction,
    ITransferTransaction,
    TransactionType,
    AbstractBlockchainTransactionUtils,
    IPosTransaction
} from '../types';

import * as ZilliqaJsAccountUtil from '@zilliqa-js/account/dist/util';
import { BN, Long } from '@zilliqa-js/util';
import * as schnorr from '@zilliqa-js/crypto/dist/schnorr';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { toChecksumAddress } from '@zilliqa-js/crypto/dist/util';
import { TransactionStatus } from '../../wallet/types';
import { TokenType, PosBasicActionType } from '../types/token';
import { Zilliqa } from '.';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { Contracts } from './config';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { splitStake } from '../../utils/balance';
import { IValidator } from '../types/stats';
import { sha256 } from 'js-sha256';

export class ZilliqaTransactionUtils extends AbstractBlockchainTransactionUtils {
    public schnorrSign(msg: Buffer, privateKey: string): string {
        const pubKey = Zilliqa.account.privateToPublic(privateKey);

        const sig = schnorr.sign(msg, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));

        let r = sig.r.toString('hex');
        let s = sig.s.toString('hex');
        while (r.length < 64) {
            r = '0' + r;
        }
        while (s.length < 64) {
            s = '0' + s;
        }

        return r + s;
    }

    public async signMessage(message: string, privateKey: string): Promise<string> {
        const publicKey = Zilliqa.account.privateToPublic(privateKey);
        const signature = this.schnorrSign(Buffer.from(sha256(message), 'hex'), privateKey);
        return JSON.stringify({
            signature,
            publicKey,
            message
        });
    }

    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const pubKey = Zilliqa.account.privateToPublic(privateKey);
        const toAddress = isBech32(tx.toAddress)
            ? fromBech32Address(tx.toAddress).toLowerCase()
            : tx.toAddress.toLowerCase();
        const transaction: any = {
            // tslint:disable-next-line: no-bitwise
            version: (Number(tx.chainId) << 16) + 1, // add replay protection
            toAddr: toAddress.replace('0x', ''),
            nonce: tx.nonce,
            pubKey,
            amount: new BN(tx.amount),
            gasPrice: new BN(tx.feeOptions.gasPrice.toString()),
            gasLimit: Long.fromString(tx.feeOptions.gasLimit.toString()),
            code: tx.code || '',
            data: tx.data?.raw || '',
            signature: '',
            priority: true
        };

        // encode transaction for signing
        const encodedTransaction = ZilliqaJsAccountUtil.encodeTransactionProto(transaction);
        // sign transaction
        const signature = this.schnorrSign(encodedTransaction, privateKey);

        // update transaction
        transaction.signature = signature;
        transaction.amount = transaction.amount.toString();
        transaction.gasLimit = transaction.gasLimit.toString();
        transaction.gasPrice = transaction.gasPrice.toString();
        transaction.toAddr = toChecksumAddress(transaction.toAddr).replace('0x', '');

        return transaction;
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Zilliqa.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE: {
                const splitAmount = splitStake(new BigNumber(tx.amount), tx.validators.length);
                for (const validator of tx.validators) {
                    const txStake: IPosTransaction = cloneDeep(tx);
                    txStake.amount = splitAmount.toFixed(0, BigNumber.ROUND_DOWN);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.STAKING
                    ].delegateStake(txStake, validator);
                    transaction.nonce = transaction.nonce + transactions.length; // increase nonce with the number of previous transactions
                    transactions.push(transaction);
                }
                break;
            }
            case PosBasicActionType.DELEGATE_V2: {
                const validators: {
                    validator: IValidator;
                    amount: string;
                }[] = tx.validators as any;

                for (const v of validators) {
                    const txStake: IPosTransaction = cloneDeep(tx);
                    txStake.amount = new BigNumber(v.amount).toFixed(0, BigNumber.ROUND_DOWN);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.STAKING
                    ].delegateStake(txStake, v.validator);
                    transaction.nonce = transaction.nonce + transactions.length; // increase nonce with the number of previous transactions
                    transactions.push(transaction);
                }
                break;
            }
            case PosBasicActionType.REDELEGATE: {
                const txUnvote = cloneDeep(tx);
                txUnvote.validators = [tx.extraFields.fromValidator];

                const shouldWithdraw = await client.contracts[
                    Contracts.STAKING
                ].canWithdrawStakeRewardsFromSsn(
                    tx.account.address,
                    tx.extraFields.fromValidator.id
                );

                if (shouldWithdraw) {
                    const txClaimReward: IPosTransaction = cloneDeep(tx);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.STAKING
                    ].withdrawStakRewards(txClaimReward, tx.extraFields.fromValidator);
                    transactions.push(transaction);
                }
                const txUnStake: IPosTransaction = cloneDeep(tx);
                const transactionUnStake: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].reDelegateStake(txUnStake, tx.extraFields.fromValidator, tx.validators[0]);
                transactionUnStake.nonce = transactionUnStake.nonce + transactions.length;
                transactions.push(transactionUnStake);

                break;
            }
            case PosBasicActionType.UNSTAKE: {
                const ssnAddress = tx.validators[0].id;
                const shouldWithdraw = await client.contracts[
                    Contracts.STAKING
                ].canWithdrawStakeRewardsFromSsn(tx.account.address, ssnAddress);

                if (shouldWithdraw) {
                    const txClaimReward: IPosTransaction = cloneDeep(tx);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.STAKING
                    ].withdrawStakRewards(txClaimReward, tx.validators[0]);
                    transactions.push(transaction);
                }

                const txUnStake: IPosTransaction = cloneDeep(tx);
                const transactionUnStake: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].withdrawStakAmt(txUnStake, tx.validators[0]);
                transactionUnStake.nonce = transactionUnStake.nonce + transactions.length;
                transactions.push(transactionUnStake);
                break;
            }
            case PosBasicActionType.CLAIM_REWARD_NO_INPUT: {
                for (const validator of tx.validators) {
                    const txClaimReward: IPosTransaction = cloneDeep(tx);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.STAKING
                    ].withdrawStakRewards(txClaimReward, validator);
                    transaction.nonce = transaction.nonce + transactions.length; // increase nonce with the number of previous transactions
                    transactions.push(transaction);
                }
                break;
            }
            case PosBasicActionType.WITHDRAW: {
                const txWithdraw = cloneDeep(tx);
                const transaction = await client.contracts[Contracts.STAKING].completeWithdrawal(
                    txWithdraw
                );
                if (transaction) transactions.push(transaction);

                break;
            }
        }

        return transactions;
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        const client = Zilliqa.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);

        const tokenInfo = getTokenConfig(tx.account.blockchain, tx.token);
        const blockInfo = await client.getCurrentBlock();

        switch (tokenInfo.type) {
            case TokenType.ZRC2:
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
                    token: tokenInfo,
                    address: tx.account.address,
                    publicKey: tx.account.publicKey,

                    toAddress: tokenInfo.contractAddress,

                    amount: '0',
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce,
                    status: TransactionStatus.PENDING,

                    data: {
                        method: 'Transfer',
                        params: [tx.toAddress, tx.amount],
                        raw: JSON.stringify({
                            _tag: 'Transfer',
                            params: [
                                {
                                    vname: 'to',
                                    type: 'ByStr20',
                                    value: fromBech32Address(tx.toAddress).toLowerCase()
                                },
                                {
                                    vname: 'amount',
                                    type: 'Uint128',
                                    value: new BigNumber(tx.amount).toFixed(0, BigNumber.ROUND_DOWN)
                                }
                            ]
                        })
                    }
                };

            // case TokenType.NATIVE:
            default:
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
                    token: tokenInfo,

                    address: tx.account.address,
                    publicKey: tx.account.publicKey,

                    toAddress: tx.toAddress,
                    amount: new BigNumber(tx.amount).toFixed(0, BigNumber.ROUND_DOWN),
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce,
                    status: TransactionStatus.PENDING
                };
        }

        // return enrichtransaction(finaltransaction);
    }

    public getTransactionAmount(tx: IBlockchainTransaction): string {
        const tokenInfo = getTokenConfig(tx.blockchain, tx.token?.symbol);
        if (tokenInfo?.type === TokenType.ZRC2 || tx?.data?.params) {
            return tx?.data?.params[1];
        } else {
            return tx.amount;
        }
    }

    public getTransactionStatusByCode(status: any): TransactionStatus {
        switch (parseInt(status, 16)) {
            case 0:
                return TransactionStatus.FAILED;
            case 1:
                return TransactionStatus.SUCCESS;
            case 2:
                return TransactionStatus.PENDING;
            default:
                return TransactionStatus.FAILED;
        }
    }
}
