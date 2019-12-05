export interface INetworksOptions {
    [blockchain: string]: {
        // key is for Blockchain enum
        order: number;
        active: boolean;
        mainNet?: number;
        testNet?: number;
    };
}

export interface IAppState {
    currentWalletId: string;
    tosVersion: number;
    devMode: boolean;
    testNet: boolean;
    networks: INetworksOptions;
}
