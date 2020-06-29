// actions consts
export const SET_HAS_UNSEEN_NOTIFICATIONS = 'SET_HAS_UNSEEN_NOTIFICATIONS';

export const setHasUnseenNotifications = (hasUnseenNotifications: boolean) => {
    return {
        type: SET_HAS_UNSEEN_NOTIFICATIONS,
        data: { hasUnseenNotifications }
    };
};
