import messaging from '@react-native-firebase/messaging';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { notificationHandler } from '../handlers/notification';

export class NotificationService {
    private messageListener = null;
    private messageBackgrounListener = null;
    private messageNotificationOpenedAppListener = null;
    private tokenRefreshListener = null;
    private localNotificationIOSListener = null;

    private token: string = null;

    public async configure() {
        try {
            const msg = messaging();

            await msg.hasPermission();
            await msg.requestPermission();

            this.token = await msg.getToken();
        } catch (error) {
            SentryCaptureException(new Error(JSON.stringify(error)));
        }

        this.createListeners();

        this.wasOpenedByNotification();
    }

    public async getToken() {
        return this.token || messaging().getToken();
    }

    private async sendNotification(message) {
        if (Platform.OS === 'android') {
            const msg = messaging();

            if (message?.data?.type) {
                await msg.sendMessage({
                    notification: {
                        title: message?.notification?.title,
                        body: message?.notification?.body
                    },
                    data: message?.data
                });
            } else {
                // notification already sent
            }
        }

        if (Platform.OS === 'ios') {
            PushNotificationIOS.addNotificationRequest({
                id: await this.getToken(),
                title: message?.notification?.title,
                body: message?.notification?.body,
                userInfo: {
                    data: message?.data
                }
            });
        }
    }

    public async createListeners() {
        const msg = messaging();

        // when app is opened
        this.messageListener = msg.onMessage(async message => {
            // received data message
            await this.sendNotification(message);
        });

        // when app is opened or in background
        this.messageBackgrounListener = msg.setBackgroundMessageHandler(async message => {
            await this.sendNotification(message);
            return null;
        });

        // Notification caused app to open from background state
        this.messageNotificationOpenedAppListener = msg.onNotificationOpenedApp(message => {
            const data = (message as any)?.data || (message as any)?.userInfo?.data;
            notificationHandler(data, true);
        });

        this.tokenRefreshListener = msg.onTokenRefresh((token: string) => {
            if (this.token !== token) {
                this.token = token;
            }
        });

        if (Platform.OS === 'ios') {
            this.localNotificationIOSListener = PushNotificationIOS.addEventListener(
                'localNotification',
                notification => {
                    const data = notification.getData();
                    const isClicked = data.userInteraction === 1;

                    if (isClicked) {
                        notificationHandler(data?.data, true);
                    }
                }
            );
        }

        // TODO: store.dispatch(getUnseenNotifications() as any);
    }

    // Check whether an initial notification is available
    public wasOpenedByNotification() {
        messaging()
            .getInitialNotification()
            .then(message => {
                // app was opened by a notification
                if (message) {
                    notificationHandler((message as any).data, true);
                }
            });
    }

    public removeListeners() {
        typeof this.messageListener === 'function' && this.messageListener();

        typeof this.messageBackgrounListener === 'function' && this.messageBackgrounListener();

        typeof this.messageNotificationOpenedAppListener === 'function' &&
            this.messageNotificationOpenedAppListener();

        typeof this.tokenRefreshListener === 'function' && this.tokenRefreshListener();

        typeof this.localNotificationIOSListener === 'function' &&
            this.localNotificationIOSListener();
    }
}

export const Notifications = new NotificationService();
