import { IClientUtils } from '../types/client-utils';
import { Client } from './client';
import { IBlockchainTransaction, Blockchain, TransactionType } from '../types';
import { TokenType, TokenScreenComponentType } from '../types/token';
import { getAddressFromPublicKey, toBech32Address } from '@zilliqa-js/crypto';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { config } from './config';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { TransactionStatus } from '../../wallet/types';

export class ClientUtils implements IClientUtils {
    constructor(private client: Client) {}

    async getTransaction(hash: string): Promise<IBlockchainTransaction> {
        const txData = await this.client.http.jsonRpc('GetTransaction', [hash]).then(response => {
            if (!response.result) {
                Promise.reject(
                    response.error.message || `Error getting transaction info for ${hash}`
                );
            }
            return response.result;
        });

        return this.buildTransactionFromBlockchain(txData);
    }

    async buildTransactionFromBlockchain(txData): Promise<IBlockchainTransaction> {
        let fromAddress = getAddressFromPublicKey(txData.senderPubKey.replace('0x', ''));
        if (!isBech32(fromAddress)) {
            fromAddress = toBech32Address(fromAddress);
        }

        const toAddress = !isBech32(txData.toAddr) ? toBech32Address(txData.toAddr) : txData.toAddr;

        // const tokenInfo = await this.client.tokens[TokenType.ZRC2].getTokenInfo(toAddress);
        const token = await this.getToken(toAddress);
        const data: any = {};

        if (token.type === TokenType.ERC20) {
            const transferEvent = (txData.receipt?.event_logs || []).find(
                event => event._eventname === 'Transfer'
            );

            data.params = [
                toBech32Address(
                    this.client.tokens[TokenType.ERC20].extractEventParamsValue(
                        transferEvent.params,
                        'recipient'
                    )
                ),
                this.client.tokens[TokenType.ERC20].extractEventParamsValue(
                    transferEvent.params,
                    'amount'
                )
            ];
        }

        return {
            id: txData.ID,
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: Blockchain.SOLANA,
            chainId: this.client.chainId,
            type: TransactionType.TRANSFER,

            address: fromAddress,
            publicKey: txData.senderPubKey,

            toAddress,
            amount: txData.amount,
            data,
            feeOptions: {
                gasPrice: txData.gasPrice,
                gasLimit: txData.gasLimit,
                feeTotal: txData.receipt?.cumulative_gas
            },
            broadcastedOnBlock: txData.receipt?.epoch_num,
            nonce: txData.nonce,
            status: this.getTransactionStatus(txData, token),
            token
        };
    }

    async getToken(toAddress: string): Promise<ITokenConfigState> {
        const token = await this.client.tokens[TokenType.ERC20].getTokenInfo(toAddress).catch(e => {
            return null;
        });

        if (!token) {
            return config.tokens.SOL;
        }

        token.type = TokenType.ERC20;
        token.ui = {
            decimals: token.decimals,
            tokenScreenComponent: TokenScreenComponentType.DEFAULT
        };

        return token;
    }

    getTransactionStatus(txData, token: ITokenConfigState): TransactionStatus {
        let status = TransactionStatus.PENDING;

        if (token.type === TokenType.ERC20) {
            const transferCallback = (txData.receipt?.event_logs || []).find(event =>
                event._eventname.startsWith('transferCallBack')
            );

            if (transferCallback._eventname === 'transferCallBack success') {
                status = TransactionStatus.SUCCESS;
            } else if (transferCallback._eventname === 'transferCallBack fail') {
                status = TransactionStatus.FAILED;
            }
        } else {
            status = txData.receipt.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
        }

        return status;
    }
}
