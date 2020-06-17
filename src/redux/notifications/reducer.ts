import { INotificationsState } from './state';
import { IAction } from '../types';

const initialState: INotificationsState = {
    notifications: undefined
};

export default (
    state: INotificationsState = initialState,
    action: IAction
): INotificationsState => {
    switch (action.type) {
        default:
            break;
    }
    return state;
};
