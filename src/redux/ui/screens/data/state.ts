import { IScreenRequest, IScreenResponse } from '../../../../components/widgets/types';

export interface IScreenData {
    // key: 'walletPubKey-blockchain-chainId-address-tab'
    [key: string]: {
        request: IScreenRequest;
        response: IScreenResponse;

        isLoading: boolean;
        error: any;
    };
}

export interface IScreenDataState {
    dashboard: IScreenData;
    token: IScreenData;
}
