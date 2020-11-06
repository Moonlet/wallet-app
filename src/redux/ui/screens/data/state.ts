import { IScreenRequest, IScreenResponse } from '../../../../components/widgets/types';

export interface IScreenData {
    request: IScreenRequest;
    response: IScreenResponse;

    isLoading: boolean;
    error: any;
}

export interface IScreenDatas {
    // key: 'walletPubKey-blockchain-chainId-address-tab'
    [key: string]: IScreenData;
}

export interface IScreenDataState {
    [screen: string]: IScreenDatas;
}
