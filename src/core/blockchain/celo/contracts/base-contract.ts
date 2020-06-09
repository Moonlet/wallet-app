import { ChainIdType, IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { Contracts } from '../config';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { Celo } from '..';
import { TransactionStatus } from '../../../wallet/types';

let contracts = {
    '44786': {
        [Contracts.LOCKED_GOLD]: '0x94c3e6675015d8479b648657e7ddfcd938489d0d',
        [Contracts.ELECTION]: ''
    }
};

export const getCeloContracts = async () => {
    return contracts;
};

export const getContractFor = async (
    chainId: ChainIdType,
    contractType: Contracts
): Promise<string> => {
    if (contracts[chainId] && contracts[chainId][contractType])
        return contracts[chainId][contractType];
    else {
        contracts = await getCeloContracts();
        return contracts[chainId][contractType];
    }
};

export const buildBaseTransaction = async (
    tx: IPosTransaction
): Promise<IBlockchainTransaction> => {
    const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Celo.getClient(tx.chainId);
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
        data: {}
    };
};
