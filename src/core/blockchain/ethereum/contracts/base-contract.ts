const contracts = {};
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { Ethereum } from '..';
import { Client as EthereumClient } from '../client';
import { ApiClient } from '../../../utils/api-client/api-client';
import {
    ChainIdType,
    Contracts,
    IBlockchainTransaction,
    IPosTransaction,
    TransactionType
} from '../../types';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { TransactionStatus } from '../../../wallet/types';

export const fetchContracts = async (chainId: ChainIdType) => {
    // TODO - fetch from blockchain

    const keyStaking = `ethereum.${chainId}.staking.contract`;
    const keyGrt = `ethereum.${chainId}.tokens.GRT`;

    try {
        const configs = await new ApiClient().configs.getConfigs([keyStaking, keyGrt]);

        const values = {
            ...contracts[chainId],
            [Contracts.STAKING]: configs.result[keyStaking],
            [Contracts.GRT_TOKEN]: configs.result[keyGrt]
        };

        return values;
    } catch (error) {
        SentryCaptureException(new Error(JSON.stringify(error)));
    }

    return contracts;
};

export const getEthContracts = async (chainId: ChainIdType) => {
    if (!contracts[chainId]) {
        contracts[chainId] = await fetchContracts(chainId);
    }
    return contracts[chainId];
};

export const getContract = async (
    chainId: ChainIdType,
    contractType: Contracts
): Promise<string> => {
    return getEthContracts(chainId).then(ethContracts => ethContracts[contractType]);
};

export const buildBaseTransaction = async (
    tx: IPosTransaction
): Promise<IBlockchainTransaction> => {
    const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Ethereum.getClient(tx.chainId) as EthereumClient;
    const nonce = await client.getNonce(tx.account.address);

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
