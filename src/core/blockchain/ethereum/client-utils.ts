import { IClientUtils } from '../types/client-utils';
import { Client } from './client';
import { IBlockchainTransaction, Blockchain, TransactionType } from '../types';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { TokenType, TokenScreenComponentType } from '../types/token';
import { config } from './config';
import abi from 'ethereumjs-abi';
import { Ethereum } from '.';
import { TransactionStatus } from '../../wallet/types';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export class ClientUtils implements IClientUtils {
    constructor(private client: Client) {}
    getTransaction(hash: string): Promise<IBlockchainTransaction> {
        const rpcCalls = [
            this.client.http.jsonRpc('eth_getTransactionByHash', [hash]),
            this.client.http.jsonRpc('eth_getTransactionReceipt', [hash])
        ];

        return Promise.all(rpcCalls).then(async res => {
            if (!res[0].result) {
                throw new Error(
                    res[0]?.error?.message || `Error getting transaction info for ${hash}`
                );
            }
            if (!res[1].result) {
                throw new Error(
                    res[1]?.error?.message || `Error getting transaction receipt for ${hash}`
                );
            }

            return this.buildTransactionFromBlockchain(res[0].result, res[1].result);
        });
    }

    async getTransactionStatus(
        hash: string,
        context: {
            address?: string;
            txData?: any;
            broadcastedOnBlock?: number;
            currentBlockNumber?: number;
            token?: ITokenConfigState;
        }
    ): Promise<TransactionStatus> {
        let status = TransactionStatus.PENDING;

        try {
            if (context?.txData?.status) {
                status = Ethereum.transaction.getTransactionStatusByCode(context.txData.status);
            } else if (context?.address) {
                const tx = await this.getTransaction(hash);
                status = tx.status;
            }
        } catch (error) {
            // tx not present
            let currentBlockNumber = context?.currentBlockNumber;
            if (!currentBlockNumber) {
                try {
                    currentBlockNumber = await this.client
                        .getCurrentBlock()
                        .then(res => res.number);
                } catch (error) {
                    SentryCaptureException(new Error(JSON.stringify(error)));
                }
            }

            if (
                currentBlockNumber &&
                context?.broadcastedOnBlock &&
                currentBlockNumber - context?.broadcastedOnBlock > 2
            ) {
                status = TransactionStatus.DROPPED;
            }
        }

        return status;
    }

    async buildTransactionFromBlockchain(txInfo, txReceipt) {
        const token = await this.getToken(txInfo.to);
        const data: any = {};

        if (token.type === TokenType.ERC20) {
            try {
                const transferInputParameteres = this.decodeInputData(
                    'transfer(address,uint256)',
                    txInfo.input
                );
                if (transferInputParameteres[0] && transferInputParameteres[1]) {
                    data.params = [
                        '0x' + transferInputParameteres[0],
                        transferInputParameteres[1].toString(10)
                    ];
                } else {
                    throw new Error('Cannot decode input data');
                }
            } catch (e) {
                // probably not a transaction
                return null;
            }
        }

        return {
            id: txInfo.hash,
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: Blockchain.ETHEREUM,
            chainId: this.client.chainId,
            type: TransactionType.TRANSFER,

            address: txInfo.from,
            publicKey: '', // TODO: get publicKey form vrs

            toAddress: txInfo.to,
            amount: txInfo.value,
            data,
            feeOptions: {
                gasPrice: txInfo.gasPrice,
                gasLimit: txInfo.gas,
                feeTotal: txReceipt.gasUsed
            },
            broadcastedOnBlock: txInfo.blockNumber,
            nonce: txInfo.nonce,
            status: Ethereum.transaction.getTransactionStatusByCode(txReceipt.status),
            token
        };
    }

    async getToken(toAddress: string): Promise<ITokenConfigState> {
        const token = await this.client.tokens[TokenType.ERC20].getTokenInfo(toAddress).catch(e => {
            // not a contract
            return null;
        });

        if (!(token && token.name && token.symbol)) {
            return config.tokens.ETH;
        }

        token.type = TokenType.ERC20;
        token.ui = {
            decimals: token.decimals,
            tokenScreenComponent: TokenScreenComponentType.DEFAULT
        };

        return token;
    }

    decodeInputData(signature: string, data: string) {
        const sig = signature.split(':');
        const sigParts = sig[0].split('(');
        const methodName = sigParts[0];
        let params = [];
        if (sigParts[1]) {
            params = sigParts[1]
                .replace(')', '')
                .split(',')
                .map(p => p.trim());
        }

        const methodId = abi.methodID(methodName, params).toString('hex');

        data = data.replace('0x', '');

        if (data.indexOf(methodId) === 0) {
            const rawParamsData = data.substr(methodId.length);
            return abi.rawDecode(params, Buffer.from(rawParamsData, 'hex'));
        } else {
            throw new Error('Cannot decode data');
        }
    }
}
