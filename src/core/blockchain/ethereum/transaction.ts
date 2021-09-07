import {
    IBlockchainTransaction,
    ITransferTransaction,
    TransactionType,
    AbstractBlockchainTransactionUtils,
    IPosTransaction,
    Contracts
} from '../types';
// import { Transaction } from 'ethereumjs-tx';
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import Common from '@ethereumjs/common';
import abi from 'ethereumjs-abi';
import BigNumber from 'bignumber.js';
import { PosBasicActionType, TokenType } from '../types/token';
import { TransactionStatus } from '../../wallet/types';
import { Ethereum } from '.';
import { cloneDeep } from 'lodash';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { splitStake } from '../../utils/balance';
import { MethodSignature } from './types';

export class EthereumTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<string> {
        const common = new Common({ chain: tx.chainId, hardfork: 'london' });

        const txData = {
            data: tx.data?.raw,
            gasLimit: '0x' + new BigNumber(tx.feeOptions.gasLimit).toString(16),
            maxPriorityFeePerGas:
                '0x' + new BigNumber(tx.feeOptions.maxPriorityFeePerGas).toString(16),
            maxFeePerGas: '0x' + new BigNumber(tx.feeOptions.maxFeePerGas).toString(16),
            nonce: '0x' + tx.nonce.toString(16),
            to: tx.toAddress,
            value: '0x' + new BigNumber(tx.amount).toString(16),
            chainId: '0x' + tx.chainId,
            accessList: [],
            type: '0x02'
        };

        const transaction = FeeMarketEIP1559Transaction.fromTxData(txData, { common });

        const txSigned = transaction.sign(Buffer.from(privateKey, 'hex'));

        const txSerialized = '0x' + txSigned.serialize().toString('hex');

        return txSerialized;
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

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

        const client = Ethereum.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
        const blockInfo = await client.getCurrentBlock();

        switch (tokenConfig.type) {
            case TokenType.ERC20:
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
                    toAddress: tokenConfig.contractAddress,
                    amount: '0',
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce,
                    status: TransactionStatus.PENDING,

                    data: {
                        method: 'transfer',
                        params: [tx.toAddress, tx.amount],
                        raw:
                            '0x' +
                            abi
                                .simpleEncode(MethodSignature.TRANSFER, tx.toAddress, tx.amount)
                                .toString('hex')
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
                    token: tokenConfig,
                    address: tx.account.address,
                    publicKey: tx.account.publicKey,

                    toAddress: tx.toAddress,
                    amount: tx.amount,
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce,
                    status: TransactionStatus.PENDING
                };
        }
    }

    public getTransactionAmount(tx: IBlockchainTransaction): string {
        const tokenInfo = getTokenConfig(tx?.blockchain, tx?.token?.symbol);
        if (tokenInfo?.type === TokenType.ERC20) {
            return tx?.data?.params[1];
        } else {
            return tx?.amount;
        }
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Ethereum.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];

        switch (transactionType) {
            case PosBasicActionType.STAKE:
            case PosBasicActionType.DELEGATE: {
                const tokenInfo = getTokenConfig(tx.account.blockchain, tx.token);

                const txIncrease: IPosTransaction = cloneDeep(tx);
                const transactionAllowance: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].increaseAllowance(txIncrease, tokenInfo.contractAddress);
                transactionAllowance.nonce = transactionAllowance.nonce + transactions.length; // increase nonce with the number of previous transactions
                transactions.push(transactionAllowance);

                const splitAmount = splitStake(new BigNumber(tx.amount), tx.validators.length);
                for (const validator of tx.validators) {
                    const txStake: IPosTransaction = cloneDeep(tx);
                    txStake.amount = splitAmount.toFixed(0, BigNumber.ROUND_DOWN);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.STAKING
                    ].delegate(txStake, validator);
                    transaction.nonce = transaction.nonce + transactions.length; // increase nonce with the number of previous transactions
                    transactions.push(transaction);
                }
                break;
            }

            case PosBasicActionType.UNSTAKE: {
                const txUnStake: IPosTransaction = cloneDeep(tx);
                const transactionUnStake: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].undelegate(txUnStake, tx.validators[0]);
                transactionUnStake.nonce = transactionUnStake.nonce + transactions.length;
                transactions.push(transactionUnStake);
                break;
            }

            case PosBasicActionType.WITHDRAW: {
                const txWithdraw = cloneDeep(tx);

                const transaction = await client.contracts[Contracts.STAKING].withdrawDelegated(
                    txWithdraw,
                    tx.validators[0]
                );
                if (transaction) transactions.push(transaction);

                break;
            }
        }

        return transactions;
    }
}
