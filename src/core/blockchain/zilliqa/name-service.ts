import {
    IResolveTextResponse,
    ResolveTextType,
    ResolveTextCode,
    ResolveTextError,
    Blockchain
} from '../types';
import { IBlockchainNameService, IResolveNameResponse } from '../types/name-service';
import { Zilliqa } from '.';
import { resolveNameForBlockchain } from '../../utils/nameResolver';

export class NameService implements IBlockchainNameService {
    public async resolveText(blockchain: Blockchain, text: string): Promise<IResolveTextResponse> {
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
            const { address } = await this.resolveName(blockchain, text);
            if (
                address === '0x0000000000000000000000000000000000000000' ||
                address === '' ||
                address === undefined
            ) {
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

    public async resolveName(blockchain, name: string): Promise<IResolveNameResponse> {
        const address = await resolveNameForBlockchain(blockchain, name);
        return Promise.resolve({ ...address });
    }
}
