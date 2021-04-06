import { IClientUtils } from '../types/client-utils';
import { Client } from './client';
import { IBlockchainTransaction, Blockchain, TransactionType } from '../types';
import { TokenType, TokenScreenComponentType } from '../types/token';
import { getAddressFromPublicKey, toBech32Address } from '@zilliqa-js/crypto';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { config } from './config';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { TransactionStatus } from '../../wallet/types';

const ZRC2_TRANSFER_EVENTS_SUCCESS_LIST = ['Transfer', 'TransferSuccess', 'TransferFromSuccess'];

export class ClientUtils implements IClientUtils {
    constructor(private client: Client) {}

    async getTransaction(hash: string): Promise<IBlockchainTransaction> {
        return this.client
            .call('GetTransaction', [hash])
            .then(response => this.buildTransactionFromBlockchain(response.result));
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
                status: await this.getTransactionStatus(txData.ID, { txData, token }),
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

        if (token && token.symbol && token.name && token.decimals) {
            token.type = TokenType.ZRC2;
            token.ui = {
                decimals: token.decimals,
                tokenScreenComponent: TokenScreenComponentType.DEFAULT
            };

            return token;
        }

        return config.tokens.ZIL;
    }

    async getTransactionStatus(
        hash: string,
        context?: {
            txData?: any;
            broadcastedOnBlock?: number;
            currentBlockNumber?: number;
            token?: ITokenConfigState;
        }
    ): Promise<TransactionStatus> {
        let status = TransactionStatus.PENDING;

        if (context?.txData) {
            if (context?.token?.type === TokenType.ZRC2) {
                const transferCallbackEvent = (context?.txData?.receipt?.event_logs || []).find(
                    event => ZRC2_TRANSFER_EVENTS_SUCCESS_LIST.indexOf(event._eventname) >= 0
                );

                status = transferCallbackEvent
                    ? TransactionStatus.SUCCESS
                    : TransactionStatus.FAILED;
            } else {
                status = context?.txData.receipt.success
                    ? TransactionStatus.SUCCESS
                    : TransactionStatus.FAILED;
            }
        } else {
            let txData;
            try {
                txData = await this.client
                    .call('GetTransactionStatus', [hash])
                    .then(res => res.result);
            } catch {
                // tx is not present on the blockchain
            }

            // modificationState	status	Description
            //        0	               0	Transaction not found
            //        0	               1	Pending - Dispatched
            //        1	               2	Pending - Soft-confirmed (awaiting Tx block generation)
            //        1	               4	Pending - Nonce is higher than expected
            //        1	               5	Pending - Microblock gas limit exceeded
            //        1	               6	Pending - Consensus failure in network
            //        2	               3	Confirmed
            //        2	               10	Rejected - Transaction caused math error
            //        2	               11	Rejected - Scilla invocation error
            //        2	               12	Rejected - Contract account initialization error
            //        2	               13	Rejected - Invalid source account
            //        2	               14	Rejected - Gas limit higher than shard gas limit
            //        2	               15	Rejected - Unknown transaction type
            //        2	               16	Rejected - Transaction sent to wrong shard
            //        2	               17	Rejected - Contract & source account cross-shard issue
            //        2	               18	Rejected - Code size exceeded limit
            //        2	               19	Rejected - Transaction verification failed
            //        2	               20	Rejected - Gas limit too low
            //        2	               21	Rejected - Insufficient balance
            //        2	               22	Rejected - Insufficient gas to invoke Scilla checker
            //        2	               23	Rejected - Duplicate transaction exists
            //        2	               24	Rejected - Transaction with same nonce but same/higher gas price exists
            //        2	               25	Rejected - Invalid destination address
            //        2	               26	Rejected - Failed to add contract account to state
            //        2	               27	Rejected - Nonce is lower than expected
            //        2	               255	Rejected - Internal error
            if (txData?.status) {
                if (txData.status === 3) {
                    status = txData.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
                } else if (txData.status >= 10) {
                    status = TransactionStatus.FAILED;
                }
            } else {
                // tx not present
                let currentBlockNumber = context?.currentBlockNumber;
                if (!currentBlockNumber) {
                    currentBlockNumber = await this.client
                        .getCurrentBlock()
                        .then(res => res.number);
                }

                if (
                    currentBlockNumber &&
                    context?.broadcastedOnBlock &&
                    currentBlockNumber - context?.broadcastedOnBlock > 2
                ) {
                    status = TransactionStatus.DROPPED;
                }
            }
        }

        return status;
    }
}
