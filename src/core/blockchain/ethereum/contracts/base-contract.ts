const contracts = {};
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { ApiClient } from '../../../utils/api-client/api-client';
import { ChainIdType, Contracts } from '../../types';

export const fetchContracts = async (chainId: ChainIdType) => {
    // TODO - fetch from blockchain

    const keyStaking = `ethereum.${chainId}.staking.contract`;

    try {
        const configs = await new ApiClient().configs.getConfigs([keyStaking]);
        const values = {
            ...contracts[chainId],
            [Contracts.STAKING]: configs.result[keyStaking]
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
    return getEthContracts(chainId).then(zilContracts => zilContracts[contractType]);
};
