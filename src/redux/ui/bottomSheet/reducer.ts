import { IBottomSheetState } from './state';
import { IAction } from '../../types';
import { OPEN_BOTTOM_SHEET, CLOSE_BOTTOM_SHEET } from './actions';

const intialState: IBottomSheetState = {
    type: undefined,
    blockchain: undefined,
    deviceModel: undefined,
    connectionType: undefined,
    data: undefined,
    wallets: undefined
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
                wallets: action.data.props?.wallets
            };
        case CLOSE_BOTTOM_SHEET:
            return intialState;
        default:
            break;
    }
    return state;
};
