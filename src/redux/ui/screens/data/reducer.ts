import { IScreenDataState } from './state';
import { IAction } from '../../../types';
import { FETCH_SCREEN_DATA, SCREEN_DATA_START_LOADING } from './actions';
import { IScreenRequest } from '../../../../components/widgets/types';
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

            return {
                ...state,
                [request.context.screen]: {
                    ...state[request.context.screen],
                    [key]: action.data
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
    tab?: string;
}): string => {
    // 'walletPubKey-blockchain-chainId-address-tab'
    let key = data.pubKey + '-' + data.blockchain + '-' + data.chainId + '-' + data.address;

    if (data?.tab) {
        key = key + '-' + data.tab;
    }

    return key;
};
