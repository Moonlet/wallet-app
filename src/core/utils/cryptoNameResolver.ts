import namehash from 'eth-ens-namehash';
import { AbiCoder } from '@ethersproject/abi';
import { simpleEncode, rawDecode } from 'ethereumjs-abi';
import { keccak256 } from '../blockchain/celo/library/hash';
import { Blockchain, BlockchainNameService } from '../blockchain/types';
import { getBlockchain } from '../blockchain/blockchain-factory';

export const cryptoNameResolver = async (
    name: string,
    service: BlockchainNameService,
    record: string[]
) => {
    const ethClient = getBlockchain(Blockchain.ETHEREUM).getClient(1);
    const coder = new AbiCoder();
    const node = namehash.hash(name);
    const data = await ethClient.http.jsonRpc('eth_call', [
        {
            to: service,
            data: '0x' + simpleEncode('getData(string[],uint256)', [], node).toString('hex')
        },
        'latest'
    ]);
    const resolverAddress =
        '0x' +
        rawDecode(
            ['address', 'address', 'string[]'],
            Buffer.from(data.result.replace('0x', ''), 'hex')
        )[0];

    const dataFunction = 'getMany(string[],uint256)';
    const hashedDataFunction = keccak256(Buffer.from(dataFunction)).substr(2, 8);
    const addresses = await ethClient.http.jsonRpc('eth_call', [
        {
            to: resolverAddress,
            data:
                '0x' +
                hashedDataFunction +
                coder.encode(['string[]', 'uint256'], [record, node]).substr(2)
        },
        'latest'
    ]);
    const decodedAddresses = coder.decode(['string[]'], addresses.result);
    return Promise.resolve({ address: decodedAddresses[0][0] });
};
