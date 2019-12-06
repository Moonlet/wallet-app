export interface IHardwareWalletApp {
    getAddress(
        index: number,
        derivationIndex: number,
        path: string
    ): Promise<{ publicKey: string; address: string }>;
    getInfo();
}
