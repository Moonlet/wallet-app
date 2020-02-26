import BigNumber from 'bignumber.js';
import { RpcClient } from '../../utils/rpc-client';
import { IBlockchainNetwork, ChainIdType } from './network';
import { IFeeOptions, IBlockchainTransaction } from './transaction';
import { IBlockchainNameService } from '.';

export interface IBlockInfo {
    number: number;
    hash?: string;
}

export abstract class BlockchainGenericClient {
    public readonly tokens: { [type: string]: any } = {};
    public nameService: IBlockchainNameService;
    public rpc: RpcClient;
    public readonly chainId: ChainIdType;

    constructor(chainId: ChainIdType, networks: IBlockchainNetwork[]) {
        let url = networks[0].url;
        const network = networks.filter(n => n.chainId === chainId)[0];
        if (network) {
            url = network.url;
        }

        this.chainId = chainId;
        this.rpc = new RpcClient(url);
    }

    public abstract getBalance(address: string): Promise<BigNumber>;
    public abstract getNonce(address: string, publicKey?: string): Promise<number>;
    public abstract getCurrentBlock(): Promise<IBlockInfo>;
    public abstract getTransactionInfo(transactionHash: string[]): Promise<IBlockchainTransaction>;

    public abstract sendTransaction(transaction: any): Promise<string>;

    public abstract calculateFees(
        from: string,
        to: string,
        amount?,
        contractAddress?
    ): Promise<IFeeOptions>;
}
