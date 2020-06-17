export interface INotificationType {
    title: string;
    subtitle: string;
    // cta: any;
    read: boolean;
}

export interface INotificationsState {
    [blockchain: string]: {
        [notifId: string]: INotificationType;
    };
}
