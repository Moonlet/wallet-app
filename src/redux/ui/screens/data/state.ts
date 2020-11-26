import { IScreenRequest, IScreenResponse } from '../../../../components/widgets/types';

export interface IScreenData {
    request: IScreenRequest;
    response: IScreenResponse;

    isLoading: boolean;
    error: any;
}

export interface IScreensData {
    // key: 'walletPubKey-blockchain-chainId-address-step-tab'
    [key: string]: IScreenData;
}

export interface IScreenDataState {
    [screen: string]: IScreensData;
}
