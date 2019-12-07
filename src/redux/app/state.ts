export interface INetworksOptions {
    [blockchain: string]: {
        // key is for Blockchain enum
        mainNet?: number;
        testNet?: number;
    };
}

export interface IBlockchainsOptions {
    [blockchain: string]: {
        order: number;
        active: boolean;
    };
}

export interface IAppState {
    currentWalletId: string;
    tosVersion: number;
    devMode: boolean;
    testNet: boolean;
    networks: INetworksOptions;
    blockchains: IBlockchainsOptions;
}
