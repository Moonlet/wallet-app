import { IResolveTextResponse, ResolveTextType, ResolveTextCode, ResolveTextError } from '../types';
import { IBlockchainNameService, IResolveNameResponse } from '../types/name-service';
import { Zilliqa } from '.';
import { Client } from './client';
import { fromBech32Address } from '@zilliqa-js/crypto';
import { namehash } from './name-services-utils';

const ZNS = 'zil1jcgu2wlx6xejqk9jw3aaankw6lsjzeunx2j0jz';

export class NameService implements IBlockchainNameService {
    constructor(private client: Client) {}

    public async resolveText(text: string): Promise<IResolveTextResponse> {
        const validAddress = Zilliqa.account.isValidAddress(text);
        const validChecksumAddress = Zilliqa.account.isValidChecksumAddress(text);

        if (validAddress) {
            return Promise.resolve({
                code: validChecksumAddress ? ResolveTextCode.OK : ResolveTextCode.WARN_CHECKSUM,
                type: ResolveTextType.ADDRESS,
                address: text,
                name: ''
            });
        } else {
            const { address } = await this.resolveName(text);
            if (address === '0x0000000000000000000000000000000000000000' || address === '') {
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
        const node = namehash(name);
        const znsFromBech = fromBech32Address(ZNS);
        const data = await this.client.getSmartContractSubState(
            znsFromBech.split('0x')[1],
            'records',
            [node]
        );
        const [ownerAddress] = data.records[node].arguments;
        return { address: ownerAddress };
    }
}
