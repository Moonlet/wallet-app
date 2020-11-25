import { Blockchain, ChainIdType } from '../blockchain/types';

export enum ConnectionPort {
    BACKGROUND = 'BACKGROUND'
}

// Extension internal communication
// between background script and:
//  - content script
//  - browser action
//
// Extension external communication
// between content script and web pages (wallet providers)

export interface IExtensionResponse {
    error?: string;
    message?: string;
    data?: any;
}

export interface IExtensionRequest {
    origin: string;
    walletPubKey?: string;
    blockchain?: Blockchain;
    chainId?: ChainIdType;
    controller: string;
    method: string;
    params: any[];
}

export interface IExtensionMessage {
    id: string;
    target?: 'MOONLET_EXTENSION';
    type: 'REQUEST' | 'RESPONSE';
    request?: IExtensionRequest;
    response?: IExtensionResponse;
}
