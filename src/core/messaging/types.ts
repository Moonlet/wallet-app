// TODO: refactor this, too many types
export enum NotificationType {
    EXTENSION_TRANSACTION = 'EXTENSION_TRANSACTION',
    TRANSACTION_UPDATE = 'TRANSACTION_UPDATE',
    TRANSACTION = 'TRANSACTION',
    INFO = 'INFO',
    MOONLET_TRANSFER = 'MOONLET_TRANSFER',
    MOONLET_SIGN_MESSAGE = 'MOONLET_SIGN_MESSAGE',
    MOONLET_CONTRACT_CALL = 'MOONLET_CONTRACT_CALL',
    MOONLET_CONTRACT_DEPLOY = 'MOONLET_CONTRACT_DEPLOY',
    EXTENSION_SIGN_TX = 'EXTENSION_SIGN_TX'
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
