import {
    ChainIdType,
    IPosTransaction,
    IBlockchainTransaction,
    TransactionType,
    Contracts
} from '../../types';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { Celo } from '..';
import { TransactionStatus } from '../../../wallet/types';

const contracts = {
    '44787': {
        [Contracts.LOCKED_GOLD]: '0x6a4CC5693DC5BFA3799C699F3B941bA2Cb00c341',
        [Contracts.ELECTION]: '0x1c3eDf937CFc2F6F51784D20DEB1af1F9a8655fA',
        [Contracts.ACCOUNTS]: '0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9'
    },
    '62320': {
        [Contracts.LOCKED_GOLD]: '0xF07406D8040fBD831e9983CA9cC278fBfFeB56bF',
        [Contracts.ELECTION]: '0x7eb2b2f696C60A48Afd7632f280c7De91c8E5aa5',
        [Contracts.ACCOUNTS]: '0x64FF4e6F7e08119d877Fd2E26F4C20B537819080'
    }
};

export const fetchContracts = async (chainId: ChainIdType) => {
    // TODO - fetch from blockchain
    return contracts;
};

export const getCeloContracts = async (chainId: ChainIdType) => {
    if (!contracts[chainId]) {
        contracts[chainId] = await fetchContracts(chainId);
    }
    return contracts[chainId];
};

export const getContract = async (
    chainId: ChainIdType,
    contractType: Contracts
): Promise<string> => {
    return getCeloContracts(chainId).then(celoContracts => celoContracts[contractType]);
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
        data: {},
        additionalInfo: tx.extraFields
    };
};
