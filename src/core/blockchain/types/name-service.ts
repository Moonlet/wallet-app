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
    constructor(protected client) {
        this.client = client;
    }
    public abstract resolveText(text: string): Promise<IResolveTextResponse>;

    public abstract resolveName(name: string): Promise<IResolveNameResponse>;
}
