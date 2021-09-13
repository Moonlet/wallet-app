import {
    IResolveTextResponse,
    ResolveTextType,
    ResolveTextCode,
    ResolveTextError,
    GenericNameService,
    BlockchainNameService,
    IResolveNameResponse
} from '../types';
import { Client } from './client';
import { cryptoNameResolver } from '../common/cryptoNameResolver';
import { ethNameResolver } from '../common/ethNameResolver';
import { zilNameResolver } from '../common/zilNameResolver';
import { config } from './config';
import { EthereumAccountUtils } from './account';

export class NameService extends GenericNameService {
    constructor(client: Client) {
        super(client);
    }

    public async resolveText(text: string): Promise<IResolveTextResponse> {
        const accountUtils = new EthereumAccountUtils();
        const validAddress = accountUtils.isValidAddress(text);
        const validChecksumAddress = accountUtils.isValidChecksumAddress(text);

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
    public resolveName(name: string): Promise<IResolveNameResponse> {
        const { mainNet } = this.client.network;
        const ending = name.split('.').pop();
        const { service, record } = config.nameServices.find(item =>
            typeof item.tld === 'string' ? item.tld === ending : !!ending.match(item.tld)
        );
        switch (service) {
            case BlockchainNameService.ENS:
                return ethNameResolver(name, service, mainNet);
            case BlockchainNameService.ZNS:
                return zilNameResolver(name, service, record, mainNet);
            case BlockchainNameService.CNS:
                return cryptoNameResolver(name, service, record, mainNet);
        }
    }
}
