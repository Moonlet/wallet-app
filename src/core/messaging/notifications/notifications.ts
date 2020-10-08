import firebase from 'react-native-firebase';
import { dataMessageHandler } from '../handlers/data-message';
import { INotificationPayload, NotificationType } from '../types';
import { notificationHandler } from '../handlers/notification';
import { store } from '../../../redux/config';
import { themes } from '../../../navigation/navigation';
import { getUnseenNotifications } from '../../../redux/notifications/actions';

// this file is in this format for testing purposes
export class NotificationService {
    public onTokenRefreshListener = null;
    public messageListener = null;
    public notificationDisplayedListener = null;
    public onNotificationListener = null;
    public onNotificationOpenedListener = null;

    public async getToken() {
        return firebase.messaging().getToken();
    }

    public async checkPermission() {
        // @ts-ignore seems like this is a must for now
        const enabled = await firebase.messaging().hasPermission();
        this.requestPermission();
    }

    public async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            // TODO: 'Messaging permission rejected';
        }
    }

    public async createListeners() {
        this.messageListener = firebase.messaging().onMessage(message => {
            // received data message
            dataMessageHandler(message.data);
        });

        // when app is opened or in background and a notification is received
        this.onNotificationListener = firebase.notifications().onNotification(notification => {
            notification.android.setChannelId('default').setSound('default');
            // if this is a transaction notification, handle it and update state and display another notification after that
            if (notification.data.type === NotificationType.TRANSACTION) {
                notificationHandler((notification as any).data, false);
            }

            this.displayNotification(
                notification.title,
                notification.body,
                (notification as any).data
            );
        });

        // called when app is opened or in background and a regular notification is displaed
        this.notificationDisplayedListener = firebase
            .notifications()
            .onNotificationDisplayed(notification => {
                store.dispatch(getUnseenNotifications() as any);
            });

        // when app is opened or in background and user taps on a notification
        this.onNotificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened(notificationOpen => {
                notificationHandler((notificationOpen.notification as any).data, false);
            });
    }

    public removeListeners() {
        typeof this.messageListener === 'function' && this.messageListener();
        typeof this.notificationDisplayedListener === 'function' &&
            this.notificationDisplayedListener();
        typeof this.onNotificationListener === 'function' && this.onNotificationListener();
        typeof this.onNotificationOpenedListener === 'function' &&
            this.onNotificationOpenedListener();
    }

    public async displayNotification(title: string, body: string, data: INotificationPayload) {
        const notification = new firebase.notifications.Notification()
            .setNotificationId('1')
            .setTitle(title)
            .setBody(body)
            .setData(data)
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .android.setChannelId('default')
            .android.setAutoCancel(true)
            .android.setSmallIcon('icon')
            .android.setColor(themes.dark.colors.accent);

        firebase.notifications().displayNotification(notification);
    }

    public async scheduleNotification(date) {
        const notification = new firebase.notifications.Notification()
            .setNotificationId('1')
            .setTitle('Test notification')
            .setBody('This is a test notification')
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .android.setChannelId('default')
            .android.setAutoCancel(true)
            .android.setSmallIcon('icon')
            .android.setColor(themes.dark.colors.accent);

        firebase
            .notifications()
            .scheduleNotification(notification, {
                fireDate: date.getTime()
            })
            .catch(err => {
                // console.error(err);
            });
    }

    public async configure() {
        const channel = new firebase.notifications.Android.Channel(
            'default',
            'default channel',
            firebase.notifications.Android.Importance.Max
        );
        firebase.notifications().android.createChannel(channel);
        this.checkPermission();
        this.createListeners();

        this.wasOpenedByNotification();
    }

    public wasOpenedByNotification() {
        firebase
            .notifications()
            .getInitialNotification()
            .then(notificationOpen => {
                if (notificationOpen) {
                    // app was opened by a notification
                    notificationHandler((notificationOpen.notification as any).data, true);
                }
            });
    }
}

export const Notifications = new NotificationService();
