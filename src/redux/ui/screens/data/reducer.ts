import { IScreenDataState } from './state';
import { IAction } from '../../../types';
import { FETCH_SCREEN_DATA } from './actions';
import { IScreenRequest } from '../../../../components/widgets/types';

const intialState: IScreenDataState = {
    dashboard: undefined,
    token: undefined
};

export default (state: IScreenDataState = intialState, action: IAction): IScreenDataState => {
    switch (action.type) {
        case FETCH_SCREEN_DATA:
            const request: IScreenRequest = action.data.request;
            // const response: IScreenResponse = action.data.response;

            const key = getScreenDataKey(request);

            if (request.context.screen === 'dashboard') {
                return {
                    ...state,
                    dashboard: {
                        ...state.dashboard,
                        [key]: action.data
                    }
                };
            }

            if (request.context.screen === 'token') {
                return {
                    ...state,
                    token: {
                        ...state.token,
                        [key]: action.data
                    }
                };
            }

            return {
                ...state
            };

        default:
            break;
    }
    return state;
};

export const getScreenDataKey = (request: IScreenRequest): string => {
    // 'walletPubKey-blockchain-chainId-address-tab'
    let key =
        request.user.wallet.pubKey +
        '-' +
        request.user.blockchain +
        '-' +
        request.user.chainId +
        '-' +
        request.user.address;

    if (request.context?.tab) {
        key = key + '-' + request.context.tab;
    }

    return key;
};
