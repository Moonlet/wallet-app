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
        txRaw: string
    ): Promise<{ tx: string }>;
    getInfo();
}
