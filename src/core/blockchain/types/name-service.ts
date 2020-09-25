import { BlockchainNameService } from '.';
import { cryptoNameResolver } from '../common/cryptoNameResolver';
import { ethNameResolver } from '../common/ethNameResolver';
import { zilNameResolver } from '../common/zilNameResolver';
import { getBlockchain } from '../blockchain-factory';
import { Blockchain } from './blockchain';

export enum ResolveTextCode {
    OK = 'OK',
    WARN_CHECKSUM = 'WARN_CHECKSUM'
}
export enum ResolveTextType {
    ADDRESS = 'ADDRESS',
    NAME = 'NAME'
}
export enum ResolveTextError {
    INVALID = 'INVALID',
    CONNECTION_ERROR = 'CONNECTION_ERROR'
}

export interface IResolveNameResponse {
    address: string;
}

export interface IResolveTextResponse {
    code: ResolveTextCode;
    type: ResolveTextType;
    address: string;
    name: string;
}

export abstract class GenericNameService {
    public blockchain: Blockchain;
    constructor(protected client, blockchain: Blockchain) {
        this.client = client;
        this.blockchain = blockchain;
    }
    public abstract resolveText(text: string): Promise<IResolveTextResponse>;

    public resolveName(name: string): Promise<IResolveNameResponse> {
        const { mainNet } = this.client.network;
        const ending = name.split('.').pop();
        const { service, record } = getBlockchain(this.blockchain).config.nameServices.find(item =>
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
