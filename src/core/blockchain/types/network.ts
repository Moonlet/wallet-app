export interface IBlockchainNetwork {
    name: string;
    chainId: number;
    url: string;
    mainNet: boolean;
    explorer: {
        getTransactionUrl: (txn: string) => string;
        getAccountUrl: (address: string) => string;
    };
}
