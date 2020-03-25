import { IPasswordModalState } from './state';
import { IAction } from '../../types';
import { DISPLAY_PASSWORD_MODAL } from './actions';

const intialState: IPasswordModalState = {
    displayPasswordModal: true
};

export default (state: IPasswordModalState = intialState, action: IAction): IPasswordModalState => {
    switch (action.type) {
        case DISPLAY_PASSWORD_MODAL:
            return {
                displayPasswordModal: action.data.visible
            };

        default:
            break;
    }
    return state;
};
