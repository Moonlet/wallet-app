import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { NearTransactionActionType, Near } from '..';
import { TransactionStatus } from '../../../wallet/types';
import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';

export const buildBaseTransaction = async (
    tx: IPosTransaction
): Promise<IBlockchainTransaction> => {
    const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Near.getClient(tx.chainId);

    const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
    const blockInfo = await client.getCurrentBlock();

    return {
        date: {
            created: Date.now(),
            signed: Date.now(),
            broadcasted: Date.now(),
            confirmed: Date.now()
        },
        blockchain: tx.account.blockchain,
        chainId: tx.chainId,
        type: TransactionType.CONTRACT_CALL,
        token: tokenConfig,
        address: tx.account.address,
        publicKey: tx.account.publicKey,
        toAddress: '',
        amount: tx.amount,
        feeOptions: tx.feeOptions,
        broadcastedOnBlock: blockInfo?.number,
        nonce,
        status: TransactionStatus.PENDING,
        data: {},
        additionalInfo: {
            ...tx.extraFields,
            currentBlockHash: blockInfo.hash,
            actions: [
                {
                    type: NearTransactionActionType.FUNCTION_CALL
                }
            ]
        }
    };
};
