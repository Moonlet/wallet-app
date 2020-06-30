import { INotificationsState } from './state';
import { IAction } from '../types';
import { SET_HAS_UNSEEN_NOTIFICATIONS, SET_NOTIFICATIONS, MARK_SEEN } from './actions';

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

        case SET_NOTIFICATIONS: {
            let notifications = {};

            action.data.notifications.map((notif: any) => {
                const notifData = {
                    walletId: notif.walletId,
                    title: notif.title,
                    body: notif.body,
                    seen: notif.seen,
                    data: notif.data
                };

                notifications = {
                    ...notifications,
                    [notif.data.blockchain]: {
                        ...notifications[notif.data.blockchain],
                        [notif._id]: notifData
                    }
                };
            });

            return {
                ...state,
                notifications
            };
        }

        case MARK_SEEN:
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    [action.data.blockchain]: {
                        ...state.notifications[action.data.blockchain],
                        [action.data.notifId]: {
                            ...state.notifications[action.data.blockchain][action.data.notifId],
                            seen: true
                        }
                    }
                }
            };

        default:
            break;
    }
    return state;
};
