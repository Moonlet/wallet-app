import { IPosActionsState } from './state';
import { IAction } from '../../../types';
import {
    QUICK_DELEGATE_ENTER_AMOUNT,
    DELEGATE_ENTER_AMOUNT,
    DELEGATE_CONFIRMATION,
    REDELEGATE_ENTER_AMOUNT,
    REDELEGATE_CONFIRMATION
} from './actions';

const intialState: IPosActionsState = {
    quickDelegateEnterAmount: undefined,
    delegateEnterAmount: undefined,
    redelegateEnterAmount: undefined,
    quickDelegateConfirm: undefined,
    delegateConfirm: undefined,
    redelegateConfirm: undefined
};

export default (state: IPosActionsState = intialState, action: IAction): IPosActionsState => {
    switch (action.type) {
        case QUICK_DELEGATE_ENTER_AMOUNT:
            return {
                ...state,
                quickDelegateEnterAmount: action.data
            };
        case DELEGATE_ENTER_AMOUNT:
            return {
                ...state,
                delegateEnterAmount: action.data
            };
        case REDELEGATE_ENTER_AMOUNT:
            return {
                ...state,
                delegateEnterAmount: action.data
            };
        case DELEGATE_CONFIRMATION:
            return {
                ...state,
                delegateConfirm: action.data
            };
        case REDELEGATE_CONFIRMATION:
            return {
                ...state,
                delegateConfirm: action.data
            };

        default:
            break;
    }
    return state;
};
