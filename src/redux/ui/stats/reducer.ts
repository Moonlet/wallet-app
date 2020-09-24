import { IStatsState } from './state';
import { IAction } from '../../types';
import { ADD_ACCOUNT_STATS } from './actions';

const initialState: IStatsState = {};

export default (state: IStatsState = initialState, action: IAction): IStatsState => {
    switch (action.type) {
        case ADD_ACCOUNT_STATS: {
            return {
                ...state,
                [action.data.blockchain]: {
                    ...state[action.data.blockchain],
                    [action.data.chainId]: {
                        ...(state[action.data.blockchain] &&
                            state[action.data.blockchain][action.data.chainId]),
                        [action.data.address]: {
                            accountStats: action.data.accountStats,
                            timestamp: new Date().getTime()
                        }
                    }
                }
            };
        }

        default:
            break;
    }
    return state;
};
