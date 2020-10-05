import BigNumber from 'bignumber.js';
import { IBlockchainNetwork, ChainIdType } from './network';
import { IFeeOptions, TransactionType } from './transaction';
import { GenericNameService } from '.';
import { HttpClient } from '../../utils/http-client';
import { PosBasicActionType, TokenType } from './token';
import { IClientUtils } from './client-utils';

export interface IBlockInfo {
    number: number;
    hash?: string;
}

export interface IBalance {
    total: BigNumber;
    available: BigNumber;
}

export abstract class BlockchainGenericClient {
    public readonly tokens: { [type: string]: any } = {};
    public nameService: GenericNameService;
    public http: HttpClient;
    public readonly chainId: ChainIdType;
    public utils: IClientUtils;
    public contracts: { [type: string]: any } = {};
    public network: IBlockchainNetwork;

    constructor(chainId: ChainIdType, networks: IBlockchainNetwork[]) {
        let url = networks[0].url;
        const network = networks.filter(n => n.chainId === chainId)[0];
        if (network) {
            url = network.url;
        }
        this.network = network;
        this.chainId = chainId;
        this.http = new HttpClient(url);
    }

    public abstract getBalance(address: string): Promise<IBalance | BigNumber>;
    public abstract getNonce(address: string, publicKey?: string): Promise<number>;
    public abstract getCurrentBlock(): Promise<IBlockInfo>;
    public abstract getMinimumAmountDelegate(): Promise<BigNumber>;

    public canPerformAction(
        action: PosBasicActionType,
        options: {
            address: string;
            validatorAddress: string[];
        }
    ): Promise<{ value: boolean; message: string }> {
        return Promise.resolve({ value: true, message: '' });
    }

    public abstract sendTransaction(transaction: any): Promise<string>;

    public abstract getFees(
        transactionType: TransactionType,
        data: {
            from?: string;
            to?: string;
            amount?: string;
            contractAddress?: string;
            raw?: string;
        },
        tokenType?: TokenType
    ): Promise<IFeeOptions>;
}
