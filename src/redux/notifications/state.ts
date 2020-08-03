export interface INotificationType {
    walletId: string;
    title: string;
    body: string;
    seen: boolean;
    data: {
        action: string;
        blockchain: string;
        // other data

        address?: string;

        // TRANSACTION extra data
        transactionHash?: string;
        chainId?: string;
        broadcastedOnBlock?: string;
        tokenSymbol?: string;

        // EXTENSION_SIGN_TX extra data
        requestId?: string;

        // OPEN_URL extra data
        url?: string;
    };

    createdAt?: Date;
    updatedAt?: Date;
}

export interface INotificationState {
    [notifId: string]: INotificationType;
}

export interface INotificationsState {
    unseenNotifications: number;
    notifications: INotificationState;
}
