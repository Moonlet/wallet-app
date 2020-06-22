import { IClientUtils } from '../types/client-utils';
import { Client } from './client';
import { IBlockchainTransaction, Blockchain, TransactionType } from '../types';
import { TokenType, TokenScreenComponentType } from '../types/token';
import { getAddressFromPublicKey, toBech32Address } from '@zilliqa-js/crypto';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { config } from './config';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { TransactionStatus } from '../../wallet/types';
import { IAccountState } from '../../../redux/wallets/state';
import { IPosWidget } from '../types/stats';

const ZRC2_TRANSFER_EVENTS_SUCCESS_LIST = ['Transfer', 'TransferSuccess', 'TransferFromSuccess'];

export class ClientUtils implements IClientUtils {
    constructor(private client: Client) {}

    async getTransaction(hash: string): Promise<IBlockchainTransaction> {
        return this.client
            .call('GetTransaction', [hash])
            .then(response => this.buildTransactionFromBlockchain(response.result));
    }

    async getWidgets(account: IAccountState): Promise<IPosWidget[]> {
        throw new Error('Method not implemented.');
    }

    async buildTransactionFromBlockchain(txData): Promise<IBlockchainTransaction> {
        let fromAddress = getAddressFromPublicKey(txData.senderPubKey.replace('0x', ''));
        if (!isBech32(fromAddress)) {
            fromAddress = toBech32Address(fromAddress);
        }

        const toAddress = !isBech32(txData.toAddr) ? toBech32Address(txData.toAddr) : txData.toAddr;

        // const tokenInfo = await this.client.tokens[TokenType.ZRC2].getTokenInfo(toAddress);
        try {
            const token = await this.getToken(toAddress);
            const data: any = {};

            if (token.type === TokenType.ZRC2) {
                if (txData.receipt.success === true) {
                    const transferEvent = (txData.receipt?.event_logs || []).find(
                        event => ZRC2_TRANSFER_EVENTS_SUCCESS_LIST.indexOf(event._eventname) >= 0
                    );

                    data.params = [
                        toBech32Address(
                            this.client.tokens[TokenType.ZRC2].extractEventParamsValue(
                                transferEvent?.params,
                                'recipient'
                            )
                        ),
                        this.client.tokens[TokenType.ZRC2].extractEventParamsValue(
                            transferEvent?.params,
                            'amount'
                        )
                    ];
                } else {
                    data.params = JSON.parse(txData.data).params;
                }
            }

            return {
                id: txData.ID,
                date: {
                    created: Date.now(),
                    signed: Date.now(),
                    broadcasted: Date.now(),
                    confirmed: Date.now()
                },
                blockchain: Blockchain.ZILLIQA,
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
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getToken(toAddress: string): Promise<ITokenConfigState> {
        const token = await this.client.tokens[TokenType.ZRC2].getTokenInfo(toAddress).catch(e => {
            return null;
        });

        if (!token) {
            return config.tokens.ZIL;
        }

        token.type = TokenType.ZRC2;
        token.ui = {
            decimals: token.decimals,
            tokenScreenComponent: TokenScreenComponentType.DEFAULT
        };

        return token;
    }

    getTransactionStatus(txData, token: ITokenConfigState): TransactionStatus {
        let status = TransactionStatus.PENDING;

        if (token.type === TokenType.ZRC2) {
            const transferCallbackEvent = (txData.receipt?.event_logs || []).find(
                event => ZRC2_TRANSFER_EVENTS_SUCCESS_LIST.indexOf(event._eventname) >= 0
            );

            status = transferCallbackEvent ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
        } else {
            status = txData.receipt.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
        }

        return status;
    }
}
