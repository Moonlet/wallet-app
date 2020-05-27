import { IPosActionsState } from './state';
import { IAction } from '../../../types';
import { QUICK_DELEGATE_ENTER_AMOUNT, DELEGATE_ENTER_AMOUNT } from './actions';

const intialState: IPosActionsState = {
    quickDelegateEnterAmount: undefined,
    delegateEnterAmount: undefined
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

        default:
            break;
    }
    return state;
};
