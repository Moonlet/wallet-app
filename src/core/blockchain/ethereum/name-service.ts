import {
    IResolveTextResponse,
    ResolveTextType,
    ResolveTextCode,
    ResolveTextError,
    Blockchain,
    GenericNameService
} from '../types';
import { Ethereum } from '.';
import { Client } from './client';

export class NameService extends GenericNameService {
    constructor(client: Client) {
        super(client, Blockchain.ETHEREUM);
    }

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
}
