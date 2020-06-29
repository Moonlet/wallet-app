export interface INotificationType {
    walletId: string;
    title: string;
    body: string;
    seen: boolean;
    data: {
        action: string;
        blockchain: string;
        // other data
    };
}

export interface INotificationsState {
    hasUnseenNotifications: boolean;
    notifications: {
        [blockchain: string]: {
            [notifId: string]: INotificationType;
        };
    };
}
