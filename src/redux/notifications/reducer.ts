import { INotificationsState } from './state';
import { IAction } from '../types';
import { SET_HAS_UNSEEN_NOTIFICATIONS } from './actions';

const initialState: INotificationsState = {
    hasUnseenNotifications: false,
    notifications: {}
};

export default (
    state: INotificationsState = initialState,
    action: IAction
): INotificationsState => {
    switch (action.type) {
        case SET_HAS_UNSEEN_NOTIFICATIONS:
            return {
                ...state,
                hasUnseenNotifications: action.data.hasUnseenNotifications
            };

        default:
            break;
    }
    return state;
};
