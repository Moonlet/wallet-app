import { IScreenRequest, IScreenResponse } from '../../../../components/widgets/types';

// key: 'walletPubKey-blockchain-chainId-address-tab'
interface IScreenData {
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
