import { EthereumTransactionUtils } from '../ethereum/transaction';
import { ITransferTransaction, IBlockchainTransaction, TransactionType } from '../types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { Celo } from '.';
import { TokenType } from '../types/token';
import { TransactionStatus } from '../../wallet/types';
import abi from 'ethereumjs-abi';
import BigNumber from 'bignumber.js';
import { keccak256 } from './library/hash';
import { encode } from './library/rlp';
import elliptic from 'elliptic';

const toHex = value => {
    if (value && value !== '0x') {
        const base = typeof value === 'string' && value.indexOf('0x') === 0 ? 16 : 10;

        let stringValue = new BigNumber(value, base).toString(16);
        if (stringValue.length % 2 > 0) {
            stringValue = '0' + stringValue;
        }
        return '0x' + stringValue;
    }
    return '0x';
};

export class CeloTransactionUtils extends EthereumTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const txData = [
            toHex(tx.nonce),
            toHex(tx.feeOptions.gasPrice),
            toHex(tx.feeOptions.gasLimit),
            '0x', // feeCurrency
            '0x', // gatewayFeeRecipient
            '0x', // gatewayFee
            (tx.toAddress || '0x').toLowerCase(),
            '0x',
            (tx.data.raw || '0x').toLowerCase(),
            toHex(tx.chainId || 1)
        ];

        const encodedTx = encode(txData.concat(['0x', '0x']));
        const txHash = keccak256(encodedTx);
        const addToV = Number(tx.chainId) * 2 + 35;

        privateKey = '0x' + privateKey.replace(/^0x/gi, '').toLowerCase();

        const ecSignature = new elliptic.ec('secp256k1')
            .keyFromPrivate(Buffer.from(privateKey.replace(/^0x/gi, ''), 'hex'))
            .sign(Buffer.from(txHash.replace(/^0x/gi, ''), 'hex'), { canonical: true });

        const signature = {
            v: toHex(addToV + ecSignature.recoveryParam),
            r: '0x' + ecSignature.r.toString(16),
            s: '0x' + ecSignature.s.toString(16)
        };

        const rawTx = txData.slice(0, 9).concat([signature.v, signature.r, signature.s]);

        return encode(rawTx);
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
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
    }
}
