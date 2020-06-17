export interface INotificationType {
    title: string;
    subtitle: string;
    // cta: any;
    read: boolean;
}

export interface INotificationsState {
    notifications: {
        [blockchain: string]: INotificationType;
    };
}
