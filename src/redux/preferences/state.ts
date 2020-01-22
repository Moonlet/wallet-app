export interface IPrefState {
    currency: string;
    testNet: boolean;
    pinLogin: boolean;
    touchID: boolean;
}

export interface INetworksOptions {
    [blockchain: string]: {
        // key is for Blockchain enum
        mainNet?: number;
        testNet?: number;
    };
}
