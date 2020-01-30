import { IDashboardScreenState } from './state';
import { IAction } from '../../../types';
import { ENABLE_CREATE_ACCOUNT, DISABLE_CREATE_ACCOUNT } from './actions';

const intialState: IDashboardScreenState = {
    isCreateAccount: false
};

export default (
    state: IDashboardScreenState = intialState,
    action: IAction
): IDashboardScreenState => {
    switch (action.type) {
        case ENABLE_CREATE_ACCOUNT:
            return {
                isCreateAccount: true
            };
        case DISABLE_CREATE_ACCOUNT:
            return {
                isCreateAccount: false
            };

        default:
            break;
    }
    return state;
};
