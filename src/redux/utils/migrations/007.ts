/**
 * Add Cumulative Balance - 4 January 2021
 */

import { IReduxState } from '../../state';

export default (state: IReduxState) => {
    state.preferences.cumulativeBalance = false;

    return {
        ...state
    };
};
