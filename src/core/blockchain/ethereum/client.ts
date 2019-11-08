import { IBlockchainClient } from '../types';
import { networks } from './networks';
import { RpcClient } from '../../utils/rpc-client';
import { BigNumber } from 'bignumber.js';

export class Client implements IBlockchainClient {
    private rpc: RpcClient;

    constructor(public chainId: number = 1) {
        let url = networks[0].url;
        const network = networks.filter(n => n.chainId === chainId)[0];
        if (network) {
            url = network.url;
        }

        this.rpc = new RpcClient(url);
    }

    public getBalance(address: string): Promise<BigNumber> {
        return this.rpc
            .call('eth_getBalance', ['0xEcFE1930ffE9F5828A9aBA39276a44d18B2E9Aa3', 'latest'])
            .then(res => {
                return new BigNumber(res.result, 16);
            });
    }
}
