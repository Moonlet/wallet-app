import namehash from 'eth-ens-namehash';
import { rawDecode, simpleEncode } from 'ethereumjs-abi';

import { IResolveTextResponse, ResolveTextType, ResolveTextCode, ResolveTextError } from '../types';
import { IBlockchainNameService, IResolveNameResponse } from '../types/name-service';
import { Ethereum } from '.';
import { Client } from './client';

// Ethereum name service address
const ENS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

export class NameService implements IBlockchainNameService {
    constructor(private client: Client) {}
    public async resolveText(text: string): Promise<IResolveTextResponse> {
        const validAddress = Ethereum.account.isValidAddress(text);
        const validChecksumAddress = Ethereum.account.isValidChecksumAddress(text);

        if (validAddress) {
            return Promise.resolve({
                code: validChecksumAddress ? ResolveTextCode.OK : ResolveTextCode.WARN_CHECKSUM,
                type: ResolveTextType.ADDRESS,
                address: text,
                name: ''
            });
        } else {
            const { address } = await this.resolveName(text);
            if (address === '0x0000000000000000000000000000000000000000') {
                return Promise.reject({
                    error: ResolveTextError.INVALID
                });
            } else {
                return Promise.resolve({
                    code: ResolveTextCode.OK,
                    type: ResolveTextType.NAME,
                    address,
                    name: ''
                });
            }
        }
    }

    public async resolveName(name: string): Promise<IResolveNameResponse> {
        const node = namehash.hash(name);
        let data = await this.client.http.jsonRpc('eth_call', [
            {
                to: ENS,
                data: '0x' + simpleEncode('resolver(bytes32)', node).toString('hex')
            },
            'latest'
        ]);
        const resolverAddress =
            '0x' + rawDecode(['address'], Buffer.from(data.result.replace('0x', ''), 'hex'))[0];
        data = await this.client.http.jsonRpc('eth_call', [
            {
                to: resolverAddress,
                data: '0x' + simpleEncode('addr(bytes32)', node).toString('hex')
            },
            'latest'
        ]);
        const address =
            '0x' + rawDecode(['address'], Buffer.from(data.result.replace('0x', ''), 'hex'))[0];
        return Promise.resolve({ address });
    }
}
