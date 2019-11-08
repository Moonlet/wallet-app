export interface IBlockchainTransaction {
    sign(): Promise<string>;
}
