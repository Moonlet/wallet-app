import {
    IResolveTextResponse,
    IResolveNameResponse,
    ResolveTextType,
    ResolveTextCode,
    ResolveTextError
} from '../types';
import { IBlockchainNameService } from '../types/name-service';
import { Ethereum } from '.';

export class NameService implements IBlockchainNameService {
    public resolveText(text: string): Promise<IResolveTextResponse> {
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
