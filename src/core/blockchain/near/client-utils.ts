import { IClientUtils } from '../types/client-utils';
import { IAccountState } from '../../../redux/wallets/state';
import { IPosWidget } from '../types/stats';
import { Client } from './client';
import { Blockchain, TransactionType, IBlockchainTransaction } from '../types';
import { Near } from '.';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';

export class ClientUtils implements IClientUtils {
    constructor(private client: Client) {}

    async getTransaction(hash: string, address?: string): Promise<IBlockchainTransaction> {
        const res = await this.client.http.jsonRpc('tx', [hash, address]);

        return this.buildTransactionFromBlockchain(
            res.result.transaction,
            res.result.status,
            res.result.transaction_outcome
        );
    }

    getWidgets(account: IAccountState): Promise<IPosWidget[]> {
        throw new Error('Method not implemented.');
    }

    async buildTransactionFromBlockchain(
        txInfo,
        txStatus,
        txOutcome
    ): Promise<IBlockchainTransaction> {
        let amount = '0';

        for (const action of txInfo.actions) {
            if (action?.Transfer?.deposit) {
                amount = String(action.Transfer.deposit);
            }
        }

        // const gasBurnt = txOutcome?.outcome?.gas_burnt;

        return {
            id: txInfo.hash,
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: Blockchain.NEAR,
            chainId: this.client.chainId,
            type: TransactionType.TRANSFER,

            address: txInfo.signer_id,
            publicKey: txInfo.public_key,

            toAddress: txInfo.receiver_id,
            amount,
            data: undefined,
            feeOptions: null,
            // feeOptions: {
            //     gasPrice: txInfo.gasPrice,
            //     gasLimit: txInfo.gas,
            //     feeTotal: txReceipt.gasUsed
            // },
            broadcastedOnBlock: undefined, // TODO
            nonce: txInfo.nonce,
            status: Near.transaction.getTransactionStatusByCode(txStatus),
            token: getTokenConfig(Blockchain.NEAR, 'NEAR')
        };
    }
}
