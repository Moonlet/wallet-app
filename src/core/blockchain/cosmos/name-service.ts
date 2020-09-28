import { IResolveTextResponse, ResolveTextType, ResolveTextCode, ResolveTextError } from '../types';
import { GenericNameService, IResolveNameResponse } from '../types/name-service';
import { Cosmos } from '.';

export class NameService extends GenericNameService {
    constructor(client) {
        super(client);
    }
    public resolveText(text: string): Promise<IResolveTextResponse> {
        const validAddress = Cosmos.account.isValidAddress(text);
        const validChecksumAddress = Cosmos.account.isValidChecksumAddress(text);

        if (validAddress) {
            return Promise.resolve({
                code: validChecksumAddress ? ResolveTextCode.OK : ResolveTextCode.WARN_CHECKSUM,
                type: ResolveTextType.ADDRESS,
                address: text,
                name: ''
            });
        } else {
            return Promise.reject({
                error: ResolveTextError.INVALID
            });
        }
    }

    public resolveName(text: string): Promise<IResolveNameResponse> {
        return Promise.resolve({ address: text });
    }
}
