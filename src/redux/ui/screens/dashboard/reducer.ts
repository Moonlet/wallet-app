import { IDashboardScreenState } from './state';
import { IAction } from '../../../types';
import {
    ENABLE_CREATE_ACCOUNT,
    DISABLE_CREATE_ACCOUNT,
    ENABLE_RECOVER_ACCOUNT,
    DISABLE_RECOVER_ACCOUNT
} from './actions';

const intialState: IDashboardScreenState = {
    isCreateAccount: false,
    isRecoverAccount: false
};

export default (
    state: IDashboardScreenState = intialState,
    action: IAction
): IDashboardScreenState => {
    switch (action.type) {
        case ENABLE_CREATE_ACCOUNT:
            return {
                ...state,
                isCreateAccount: true
            };

        case DISABLE_CREATE_ACCOUNT:
            return {
                ...state,
                isCreateAccount: false
            };

        case ENABLE_RECOVER_ACCOUNT: {
            return {
                ...state,
                isRecoverAccount: true
            };
        }

        case DISABLE_RECOVER_ACCOUNT: {
            return {
                ...state,
                isRecoverAccount: false
            };
        }

        default:
            break;
    }
    return state;
};
