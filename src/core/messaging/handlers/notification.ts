import { NotificationType, INotificationPayload } from '../types';
import { signExtensionTransaction } from '../../wallet-connect/utils';
import { NavigationParams } from 'react-navigation';
import { NavigationService } from '../../../navigation/navigation-service';
import { store } from '../../../redux/config';
import { setSelectedWallet } from '../../../redux/wallets/actions';

export const notificationHandler = (
    notification: INotificationPayload,
    openedByNotification: boolean = false
) => {
    switch (notification.type) {
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

        case NotificationType.EXTENSION_TRANSACTION:
            signExtensionTransaction(notification.data);
            break;

        default:
            // general info?
            break;
    }
};
