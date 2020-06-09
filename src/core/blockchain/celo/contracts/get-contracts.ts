import { ChainIdType } from '../../types';
import { Contracts } from '../config';

let contracts = {
    '44786': {
        [Contracts.LOCKED_GOLD]: '0x94c3e6675015d8479b648657e7ddfcd938489d0d'
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
