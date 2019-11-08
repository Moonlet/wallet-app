import BigNumber from 'bignumber.js';

export interface IBlockchainClient {
    getBalance(address: string): Promise<BigNumber>;
}
