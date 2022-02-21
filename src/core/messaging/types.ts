// TODO: refactor this, too many types
export enum NotificationType {
    TRANSACTION_UPDATE = 'TRANSACTION_UPDATE',
    TRANSACTION = 'TRANSACTION',
    INFO = 'INFO',

    MOONLET_TRANSACTION = 'MOONLET_TRANSACTION',
    MOONLET_SIGN_MESSAGE = 'MOONLET_SIGN_MESSAGE',
    MOONLET_TRANSFER = 'MOONLET_TRANSFER'
}

export enum SilentMessageType {
    WALLET_CONNECT = 'WALLET_CONNECT',
    TRANSACTION = 'TRANSACTION'
}

export interface INotificationPayload {
    type: NotificationType;
    data: any;
}

export interface INotificationInfo extends INotificationPayload {
    openedByNotification: boolean;
}

export interface ISilentMessage {
    type: SilentMessageType;
    data: any;
}

export enum PushNotifTokenType {
    FCM = 'FCM',
    APN = 'APN'
}
