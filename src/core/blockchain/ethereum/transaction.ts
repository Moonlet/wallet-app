import {
    IBlockchainTransaction,
    ITransferTransaction,
    IAdditionalInfoType,
    TransactionType
} from '../types';
import { Transaction } from 'ethereumjs-tx';
import abi from 'ethereumjs-abi';
import BigNumber from 'bignumber.js';
import { TokenType } from '../types/token';
import { TransactionStatus } from '../../wallet/types';

export const sign = async (
    tx: IBlockchainTransaction<IAdditionalInfoType>,
    privateKey: string
): Promise<any> => {
    const transaction = new Transaction(
        {
            nonce: '0x' + tx.nonce.toString(16),
            gasPrice: '0x' + tx.feeOptions.gasPrice,
            gasLimit: '0x' + tx.feeOptions.gasLimit,
            to: tx.toAddress,
            value: '0x' + new BigNumber(tx.amount).toString(16),
            data: tx.additionalInfo?.data
        },
        {
            chain: tx.chainId
        }
    );

    transaction.sign(Buffer.from(privateKey, 'hex'));

    return '0x' + transaction.serialize().toString('hex');
};

export const buildTransferTransaction = (
    tx: ITransferTransaction
): IBlockchainTransaction<IAdditionalInfoType> => {
    const tokenInfo = tx.account.tokens[tx.token];

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
                token: tokenInfo,
                address: tx.account.address,
                publicKey: tx.account.publicKey,

                toAddress: tokenInfo.contractAddress,

                amount: '0',
                feeOptions: tx.feeOptions,
                broadcatedOnBlock: undefined,
                nonce: tx.nonce,
                status: TransactionStatus.PENDING,

                additionalInfo: {
                    data:
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
                token: tokenInfo,

                address: tx.account.address,
                publicKey: tx.account.publicKey,

                toAddress: tx.toAddress,
                amount: tx.amount,
                feeOptions: tx.feeOptions,
                broadcatedOnBlock: undefined,
                nonce: tx.nonce,
                status: TransactionStatus.PENDING
            };
    }
};
