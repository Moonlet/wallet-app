import { NotificationType, INotificationPayload } from '../types';
import { NavigationParams } from 'react-navigation';
import { NavigationService } from '../../../navigation/navigation-service';
import { store } from '../../../redux/config';
import { setSelectedWallet, updateTransactionFromBlockchain } from '../../../redux/wallets/actions';
import { takeOneAndSubscribeToStore } from '../../../redux/utils/helpers';
import { openTransactionRequest } from '../../../redux/ui/transaction-request/actions';
import { markSeenNotification, getUnseenNotifications } from '../../../redux/notifications/actions';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export const notificationHandler = async (
    notification: INotificationPayload,
    openedByNotification: boolean = false
) => {
    if (openedByNotification) {
        // used this in order to make sure that state is loaded
        takeOneAndSubscribeToStore(store, (state, unsub) => {
            if (store.getState()?._persist?.rehydrated) {
                unsub && unsub();
                handleNotification(notification, openedByNotification);
            }
        });
    } else {
        handleNotification(notification, openedByNotification);
    }

    try {
        const parsedData = JSON.parse(notification.data);

        if (parsedData?.notification?._id) {
            store.dispatch(markSeenNotification(parsedData.notification._id) as any);
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

const handleNotification = (
    notification: INotificationPayload,
    openedByNotification: boolean = false
) => {
    store.dispatch(getUnseenNotifications() as any);

    switch (notification.type) {
        case NotificationType.TRANSACTION:
            const data = JSON.parse(notification.data);

            /**
             * if the app was already opened, no notification was displayed, update the transaction and display a notification
             *
             * if the app was opened by tapping on the notification then update the transaction from blockchain,
             * navigato to transaction page and dont display another transaction
             */
            store.dispatch(
                // @ts-ignore
                updateTransactionFromBlockchain(
                    data.transactionHash,
                    data.blockchain,
                    data.chainId,
                    data.broadcastedOnBlock,
                    openedByNotification
                ) as any
            );
            break;

        case NotificationType.TRANSACTION_UPDATE:
            const navigationParams: NavigationParams = {
                blockchain: notification.data.blockchain,
                accountIndex: notification.data.accountIndex,
                token: notification.data.token,
                tokenLogo: notification.data.tokenLogo
            };

            store.dispatch(setSelectedWallet(notification.data.walletId));

            NavigationService.navigate('Token', navigationParams);
            break;

        case NotificationType.MOONLET_TRANSFER:
            try {
                const requestId = JSON.parse(notification.data)?.requestId;

                if (requestId) {
                    store.dispatch(openTransactionRequest({ requestId }));
                } else {
                    // maybe find a way to handle this
                    // show a message to the user or something
                    SentryCaptureException(
                        new Error(
                            JSON.stringify({
                                requestId,
                                notificationType: NotificationType.MOONLET_TRANSFER
                            })
                        )
                    );
                }
            } catch (err) {
                SentryCaptureException(new Error(JSON.stringify(err)));
            }

            break;

        default:
            // general info?
            break;
    }
};
