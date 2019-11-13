export interface INetworksOptions {
    [blockchain: string]: {
        // key is for Blockchain enum
        mainNet?: number;
        testNet?: number;
    };
}

export interface IAppState {
    currentWalletIndex: number;
    tosVersion: number;
    devMode: boolean;
    testNet: boolean;
    networks: INetworksOptions;
}
