import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { TransactionStatus } from '../../../wallet/types';
import { Client as SolanaClient } from '../client';
import { Solana } from '..';

export const buildBaseTransaction = async (
    tx: IPosTransaction
): Promise<IBlockchainTransaction> => {
    const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Solana.getClient(tx.chainId) as SolanaClient;
    const nonce = 1;

    const blockHash = await client.getCurrentBlockHash();
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
            currentBlockHash: blockHash
        }
    };
};
