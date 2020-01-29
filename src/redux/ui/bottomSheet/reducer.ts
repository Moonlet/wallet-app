import { IBottomSheetState } from './state';
import { IAction } from '../../types';
import {
    OPEN_BOTTOM_SHEET,
    CLOSE_BOTTOM_SHEET,
    ENABLE_CREATE_ACCOUNT,
    DISABLE_CREATE_ACCOUNT
} from './actions';

const intialState: IBottomSheetState = {
    type: undefined,
    blockchain: undefined,
    deviceModel: undefined,
    connectionType: undefined,
    data: undefined,
    isCreateAccount: false
};

export default (state: IBottomSheetState = intialState, action: IAction): IBottomSheetState => {
    switch (action.type) {
        case OPEN_BOTTOM_SHEET:
            return {
                type: action.data.type,
                blockchain: action.data.props?.blockchain,
                deviceModel: action.data.props?.deviceModel,
                connectionType: action.data.props?.connectionType,
                data: action.data.props?.data,
                isCreateAccount: false
            };
        case CLOSE_BOTTOM_SHEET:
            return intialState;
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
        default:
            break;
    }
    return state;
};
