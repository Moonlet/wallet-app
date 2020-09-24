import { Blockchain } from '.';

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

export interface IBlockchainNameService {
    resolveText(blockchain: Blockchain, text: string): Promise<IResolveTextResponse>;
    resolveName(blockchain: Blockchain, text: string): Promise<IResolveNameResponse>;
}
