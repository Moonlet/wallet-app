export type ChainIdType = number | string;

export interface IBlockchainNetwork {
    name: string;
    chainId: ChainIdType;
    url: string;
    mainNet: boolean;
    explorer: {
        name: string;
        getTransactionUrl: (txn: string) => string;
        getAccountUrl: (address: string) => string;
    };
    links?: {
        [name: string]: (publicKey: string) => string;
    };
}
