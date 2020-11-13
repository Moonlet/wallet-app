import { Solana } from '.';
import {
    IResolveTextResponse,
    IResolveNameResponse,
    ResolveTextType,
    ResolveTextCode,
    ResolveTextError
} from '../types';
import { GenericNameService } from '../types/name-service';

export class NameService extends GenericNameService {
    public resolveText(text: string): Promise<IResolveTextResponse> {
        const validAddress = Solana.account.isValidAddress(text);
        const validChecksumAddress = Solana.account.isValidChecksumAddress(text);

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
        return Promise.resolve({
            address: text
        });
    }
}
