import { IScreenDataState } from './state';
import { IAction } from '../../../types';
import { FETCH_SCREEN_DATA, START_LOADING } from './actions';
import { ContextScreen, IScreenRequest } from '../../../../components/widgets/types';
import { Blockchain } from '../../../../core/blockchain/types';

const intialState: IScreenDataState = {
    dashboard: undefined,
    token: undefined
};

export default (state: IScreenDataState = intialState, action: IAction): IScreenDataState => {
    switch (action.type) {
        case START_LOADING: {
            const request: IScreenRequest = action.data.request;

            const key = getScreenDataKey({
                pubKey: request.user.wallet.pubKey,
                blockchain: request.user.blockchain,
                chainId: request.user.chainId,
                address: request.user.address,
                tab: request.context?.tab
            });

            return {
                ...state,
                [request.context.screen]: {
                    ...state[request.context.screen],
                    [key]: {
                        request,
                        response:
                            state[request.context.screen] &&
                            state[request.context.screen][key]?.response,
                        isLoading: true,
                        error: undefined
                    }
                }
            };
        }

        case FETCH_SCREEN_DATA: {
            const request: IScreenRequest = action.data.request;

            const key = getScreenDataKey({
                pubKey: request.user.wallet.pubKey,
                blockchain: request.user.blockchain,
                chainId: request.user.chainId,
                address: request.user.address,
                tab: request.context?.tab
            });

            if (request.context.screen === ContextScreen.DASHBOARD) {
                return {
                    ...state,
                    dashboard: {
                        ...state.dashboard,
                        [key]: action.data
                    }
                };
            }

            if (request.context.screen === ContextScreen.TOKEN) {
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
        }

        default:
            break;
    }
    return state;
};

export const getScreenDataKey = (data: {
    pubKey: string;
    blockchain: Blockchain;
    chainId: string;
    address: string;
    tab?: string;
}): string => {
    // 'walletPubKey-blockchain-chainId-address-tab'
    let key = data.pubKey + '-' + data.blockchain + '-' + data.chainId + '-' + data.address;

    if (data?.tab) {
        key = key + '-' + data.tab;
    }

    return key;
};
