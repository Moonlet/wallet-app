export interface IPrefState {
    currency: string;
    testNet: boolean;
    pinLogin: boolean;
    touchID: boolean;
    networks: INetworksOptions;
    blockchains: IBlockchainsOptions;
}

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
