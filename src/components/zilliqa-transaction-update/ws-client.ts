import { WsClient } from '../../core/blockchain/zilliqa/ws-client';

const wsClient = {};

export const getWsClient = (chainId: string): WsClient => {
    if (!wsClient[chainId]) {
        const ws = new WsClient(chainId);
        wsClient[chainId] = ws;
    }
    return wsClient[chainId];
};
