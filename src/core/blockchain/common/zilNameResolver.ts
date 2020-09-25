import { namehash } from '../zilliqa/name-services-utils';
import { fromBech32Address } from '@zilliqa-js/crypto';
import { getBlockchain } from '../blockchain-factory';
import { Blockchain, BlockchainNameService, IResolveNameResponse } from '../types';
import { Client as ZiliqaClient } from '../zilliqa/client';

const chainID = {
    mainNet: 1,
    testNet: 333
};

export const zilNameResolver = async (
    name: string,
    service: BlockchainNameService,
    record: string[],
    mainNet: boolean = true
): Promise<IResolveNameResponse> => {
    const zilClient = getBlockchain(Blockchain.ZILLIQA).getClient(
        mainNet ? chainID.mainNet : chainID.testNet
    ) as ZiliqaClient;
    const node = namehash(name);
    const znsFromBech = fromBech32Address(service);
    const data = await zilClient.getSmartContractSubState(znsFromBech.split('0x')[1], 'records', [
        node
    ]);
    const [, resolverAddress] = data.records[node].arguments;
    const address = await zilClient.getSmartContractSubState(resolverAddress, 'records', []);
    return Promise.resolve({ address: address.records[record[0]] });
};
