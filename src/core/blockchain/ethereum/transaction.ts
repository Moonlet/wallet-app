import { IBlockchainTransaction, ITransferTransaction, TransactionType } from '../types';
import { Transaction } from 'ethereumjs-tx';
import abi from 'ethereumjs-abi';
import BigNumber from 'bignumber.js';
import { TokenType } from '../types/token';
import { TransactionStatus } from '../../wallet/types';
import { Ethereum } from '.';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';

export const sign = async (tx: IBlockchainTransaction, privateKey: string): Promise<any> => {
    const transaction = new Transaction(
        {
            nonce: '0x' + tx.nonce.toString(16),
            gasPrice: '0x' + new BigNumber(tx.feeOptions.gasPrice).toString(16),
            gasLimit: '0x' + new BigNumber(tx.feeOptions.gasLimit).toString(16),
            to: tx.toAddress,
            value: '0x' + new BigNumber(tx.amount).toString(16),
            data: tx.data?.raw
        },
        {
            chain: tx.chainId
        }
    );

    transaction.sign(Buffer.from(privateKey, 'hex'));

    return '0x' + transaction.serialize().toString('hex');
};

export const getTransactionStatusByCode = (status): TransactionStatus => {
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
};

export const buildTransferTransaction = async (
    tx: ITransferTransaction
): Promise<IBlockchainTransaction> => {
    const tokenInfo = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Ethereum.getClient(tx.chainId);
    const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);

    switch (tokenInfo.type) {
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
                token: tx.account.tokens[tx.chainId][tx.token],
                address: tx.account.address,
                publicKey: tx.account.publicKey,
                toAddress: tokenInfo.contractAddress,
                amount: '0',
                feeOptions: tx.feeOptions,
                broadcatedOnBlock: undefined,
                nonce,
                status: TransactionStatus.PENDING,

                data: {
                    method: 'transfer',
                    params: [tx.toAddress, tx.amount],
                    raw:
                        '0x' +
                        abi
                            .simpleEncode('transfer(address,uint256)', tx.toAddress, tx.amount)
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
                token: tx.account.tokens[tx.chainId][tx.token],

                address: tx.account.address,
                publicKey: tx.account.publicKey,

                toAddress: tx.toAddress,
                amount: tx.amount,
                feeOptions: tx.feeOptions,
                broadcatedOnBlock: undefined,
                nonce,
                status: TransactionStatus.PENDING
            };
    }
};

export const getTransactionAmount = (tx: IBlockchainTransaction): string => {
    const tokenInfo = getTokenConfig(tx.blockchain, tx.token?.symbol);
    if (tokenInfo.type === TokenType.ERC20) {
        return tx?.data?.params[1];
    } else {
        return tx.amount;
    }
};
