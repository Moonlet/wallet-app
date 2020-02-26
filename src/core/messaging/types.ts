export enum NotificationType {
    EXTENSION_TRANSACTION = 'EXTENSION_TRANSACTION',
    TRANSACTION_UPDATE = 'TRANSACTION_UPDATE',
    INFO = 'INFO'
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
