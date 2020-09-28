import namehash from 'eth-ens-namehash';
import { simpleEncode, rawDecode } from 'ethereumjs-abi';
import { getBlockchain } from '../blockchain-factory';
import { Blockchain, BlockchainNameService, IResolveNameResponse } from '../types';

const chainID = {
    mainnet: 1,
    testnet: 3
};

export const ethNameResolver = async (
    name: string,
    service: BlockchainNameService,
    mainnet: boolean = true
): Promise<IResolveNameResponse> => {
    const ethClient = getBlockchain(Blockchain.ETHEREUM).getClient(
        mainnet ? chainID.mainnet : chainID.testnet
    );
    const node = namehash.hash(name);
    let data = await ethClient.http.jsonRpc('eth_call', [
        {
            to: service,
            data: '0x' + simpleEncode('resolver(bytes32)', node).toString('hex')
        },
        'latest'
    ]);
    const resolverAddress =
        '0x' + rawDecode(['address'], Buffer.from(data.result.replace('0x', ''), 'hex'))[0];
    data = await ethClient.http.jsonRpc('eth_call', [
        {
            to: resolverAddress,
            data: '0x' + simpleEncode('addr(bytes32)', node).toString('hex')
        },
        'latest'
    ]);
    const address =
        '0x' + rawDecode(['address'], Buffer.from(data.result.replace('0x', ''), 'hex'))[0];
    return Promise.resolve({ address });
};
