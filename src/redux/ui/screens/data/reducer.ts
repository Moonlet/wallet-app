import { IScreenData, IScreenDataState } from './state';
import { IAction } from '../../../types';
import {
    FETCH_SCREEN_DATA,
    LOAD_MORE_VALIDATORS,
    LOAD_MORE_VALIDATORS_V2,
    SCREEN_DATA_START_LOADING
} from './actions';
import {
    ContextScreen,
    IScreenModule,
    IScreenRequest,
    IScreenWidget
} from '../../../../components/widgets/types';
import { Blockchain } from '../../../../core/blockchain/types';

const intialState: IScreenDataState = {};

export default (state: IScreenDataState = intialState, action: IAction): IScreenDataState => {
    switch (action.type) {
        case SCREEN_DATA_START_LOADING: {
            const request: IScreenRequest = action.data.request;

            const key = getScreenDataKey({
                pubKey: request.user.wallet.pubKey,
                blockchain: request.user.blockchain,
                chainId: request.user.chainId,
                address: request.user.address,
                step: request.context?.step,
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
                step: request.context?.step,
                tab: request.context?.tab
            });

            return {
                ...state,
                [request.context.screen]: {
                    ...state[request.context.screen],
                    [key]: action.data
                }
            };
        }

        case LOAD_MORE_VALIDATORS: {
            const screenData: IScreenData = {
                ...state[ContextScreen.QUICK_STAKE_SELECT_VALIDATOR][action.data.screenKey]
            };

            screenData.response.widgets.map((widget: IScreenWidget) =>
                widget.modules.map((module: IScreenModule) => {
                    // Show all the modules
                    if (module?.hidden === true) {
                        module.hidden = false;
                    }

                    // Hide Load More module
                    if (module?.hidden === undefined) {
                        module.hidden = true;
                    }
                })
            );

            return {
                ...state,
                [ContextScreen.QUICK_STAKE_SELECT_VALIDATOR]: {
                    ...state[ContextScreen.QUICK_STAKE_SELECT_VALIDATOR],
                    screenData
                }
            };
        }

        case LOAD_MORE_VALIDATORS_V2: {
            const screenData: IScreenData = {
                ...state[action.data.screen][action.data.screenKey]
            };

            screenData.response.widgets.map((widget: IScreenWidget) =>
                widget.modules.map((module: IScreenModule) => {
                    // Show all the modules
                    if (module?.hidden === true) {
                        module.hidden = false;
                    }

                    // Hide Load More module
                    if (module?.hidden === undefined) {
                        module.hidden = true;
                    }
                })
            );

            return {
                ...state,
                [action.data.screen]: {
                    ...state[action.data.screen],
                    screenData
                }
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
    step: string;
    tab: string;
}): string => {
    // 'walletPubKey-blockchain-chainId-address-step-tab'
    let key = data.pubKey + '-' + data.blockchain + '-' + data.chainId + '-' + data.address;

    if (data?.step) {
        key = key + '-' + data.step;
    }

    if (data?.tab) {
        key = key + '-' + data.tab;
    }

    return key;
};
