import { namehash } from '../blockchain/zilliqa/name-services-utils';
import { fromBech32Address } from '@zilliqa-js/crypto';
import { getBlockchain } from '../blockchain/blockchain-factory';
import { Blockchain, BlockchainNameService, IResolveNameResponse } from '../blockchain/types';
import { Client as ZiliqaClient } from '../blockchain/zilliqa/client';

export const zilNameResolver = async (
    name: string,
    service: BlockchainNameService,
    record: string[]
): Promise<IResolveNameResponse> => {
    const zilClient = getBlockchain(Blockchain.ZILLIQA).getClient(1) as ZiliqaClient;
    const node = namehash(name);
    const znsFromBech = fromBech32Address(service);
    const data = await zilClient.getSmartContractSubState(znsFromBech.split('0x')[1], 'records', [
        node
    ]);
    const [, resolverAddress] = data.records[node].arguments;
    const address = await zilClient.getSmartContractSubState(resolverAddress, 'records', []);
    return Promise.resolve({ address: address.records[record[0]] });
};
