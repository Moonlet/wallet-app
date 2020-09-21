import { ILedgerConnectState } from './state';
import { IAction } from '../../types';
import { DISPLAY_LEDGER_CONNECT } from './actions';

const intialState: ILedgerConnectState = {
    displayLedgerConnect: false,
    blockchain: undefined,
    deviceModel: undefined,
    connectionType: undefined
};

export default (state: ILedgerConnectState = intialState, action: IAction): ILedgerConnectState => {
    switch (action.type) {
        case DISPLAY_LEDGER_CONNECT:
            return {
                displayLedgerConnect: action.data.visible,
                blockchain: action.data.blockchain,
                deviceModel: action.data.deviceModel,
                connectionType: action.data.connectionType
            };

        default:
            break;
    }
    return state;
};
