import { EthereumTransactionUtils } from '../ethereum/transaction';
import { ITransferTransaction, IBlockchainTransaction, TransactionType } from '../types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { Celo } from '.';
import { TokenType } from '../types/token';
import { TransactionStatus } from '../../wallet/types';
import abi from 'ethereumjs-abi';
import { Transaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';

export class CeloTransactionUtils extends EthereumTransactionUtils {
    public sign = async (tx: IBlockchainTransaction, privateKey: string): Promise<any> => {
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

    public buildTransferTransaction = async (
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> => {
        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

        const client = Celo.getClient(tx.chainId);
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
    };
}
