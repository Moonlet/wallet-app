import { ILedgerState } from './state';
import { IAction } from '../../types';
import { VERIFY_ADDRESS_ON_DEVICE } from './actions';

const intialState: ILedgerState = {
    verifyAddress: false
};

export default (state: ILedgerState = intialState, action: IAction): ILedgerState => {
    switch (action.type) {
        case VERIFY_ADDRESS_ON_DEVICE:
            return { ...state, verifyAddress: action.data };

        default:
            break;
    }
    return state;
};
