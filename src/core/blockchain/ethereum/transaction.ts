import { IEthereumTxOptions } from '.';
import { IBlockchainTransaction, ITransferTransaction } from '../types';
import { Transaction } from 'ethereumjs-tx';
import abi from 'ethereumjs-abi';
import BigNumber from 'bignumber.js';
import { TokenType } from '../types/token';

export const sign = async (
    tx: IBlockchainTransaction<IEthereumTxOptions>,
    privateKey: string
): Promise<any> => {
    const transaction = new Transaction(
        {
            nonce: '0x' + new BigNumber(tx.options.nonce).toString(16),
            gasPrice: '0x' + new BigNumber(tx.options.gasPrice).toString(16),
            gasLimit: '0x' + new BigNumber(tx.options.gasLimit).toString(16),
            to: tx.to,
            value: '0x' + tx.amount.toString(16),
            data: tx.options.data
            // chainId: "0x" + new BigNumber(tx.options.chainId).toString(16),

            // v: "0x" + new BigNumber(tx.options.chainId).toString(16),
            // r: "0x00",
            // s: "0x00"
        },
        {
            chain: tx.options.chainId
        }
    );

    transaction.sign(Buffer.from(privateKey, 'hex'));
    return '0x' + transaction.serialize().toString('hex');
};

export const buildTransferTransaction = (
    tx: ITransferTransaction
): IBlockchainTransaction<IEthereumTxOptions> => {
    const tokenInfo = tx.account.tokens[tx.token];

    switch (tokenInfo.type) {
        case TokenType.ERC20:
            return {
                from: tx.account.address,
                to: tokenInfo.contractAddress,
                amount: new BigNumber(0),
                options: {
                    nonce: tx.nonce,
                    gasPrice: tx.gasPrice.toNumber(),
                    gasLimit: tx.gasLimit,
                    chainId: tx.chainId,
                    data:
                        '0x' +
                        abi
                            .simpleEncode(
                                'transfer(address,uint256)',
                                tx.toAddress,
                                tx.amount.toString()
                            )
                            .toString('hex')
                }
            };

        // case TokenType.NATIVE:
        default:
            return {
                from: tx.account.address,
                to: tx.toAddress,
                amount: tx.amount,
                options: {
                    nonce: tx.nonce,
                    gasPrice: tx.gasPrice.toNumber(),
                    gasLimit: tx.gasLimit,
                    chainId: tx.chainId
                }
            };
    }
};
