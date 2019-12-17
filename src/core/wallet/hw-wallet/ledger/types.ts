import { IBlockchainTransaction } from '../../../blockchain/types';

export interface IHardwareWalletApp {
    getAddress(
        index: number,
        derivationIndex: number,
        path: string
    ): Promise<{ publicKey: string; address: string }>;
    signTransaction(
        index: number,
        derivationIndex: number,
        path: string,
        txRaw: IBlockchainTransaction
    ): Promise<any>;
    getInfo();
}
