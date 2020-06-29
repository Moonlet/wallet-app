export interface INotificationType {
    title: string;
    subtitle: string;
    // cta: any;
    read: boolean;
}

export interface INotificationsState {
    hasUnseenNotifications: boolean;
    notifications: {
        [blockchain: string]: {
            [notifId: string]: INotificationType;
        };
    };
}
