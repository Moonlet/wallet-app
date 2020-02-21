import firebase from 'react-native-firebase';
import { Alert } from 'react-native';
import { dataMessageHandler } from '../handlers/data-message';
import { INotificationPayload } from '../types';
import { notificationHandler } from '../handlers/notification';

// this file is in this format for testing purposes
export class NotificationService {
    public onTokenRefreshListener = null;
    public messageListener = null;
    public notificationDisplayedListener = null;
    public onNotificationListener = null;
    public onNotificationOpenedListener = null;

    public async getToken() {
        const fcmToken = await firebase.messaging().getToken();
        // console.log('Messaging permissions enabled: ' + fcmToken);
        return fcmToken;
    }

    public async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // seems like this is a must
            // even is permissions were already granted
            this.requestPermission();
        } else {
            this.requestPermission();
        }
    }

    public async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            // TODO: console.log('Messaging permission rejected');
        }
    }

    public async createListeners() {
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async fcmToken => {
            // console.log(`Retrieved new token: ${fcmToken}`);
        });

        this.messageListener = firebase.messaging().onMessage(message => {
            // received data message
            dataMessageHandler(message.data);
        });

        this.notificationDisplayedListener = firebase
            .notifications()
            .onNotificationDisplayed(notification => {
                // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            });

        this.onNotificationListener = firebase.notifications().onNotification(notification => {
            // UNCOMMENT IF YOU WANT ANDROID TO DISPLAY THE NOTIFICATION
            notification.android.setChannelId('default').setSound('default');
            firebase.notifications().displayNotification(notification);

            Alert.alert('Push Notification', notification.body, [{ text: 'OK' }], {
                cancelable: false
            });
        });

        this.onNotificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened(notificationOpen => {
                // check here for different types of notifications
                // this gets called when app is opened but in background
                notificationHandler((notificationOpen.notification as any).data, false);
                // signExtensionTransaction(notification.data);
            });
    }

    public removeListeners() {
        this.messageListener();
        this.notificationDisplayedListener();
        this.onNotificationListener();
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
            .android.setAutoCancel(true);

        firebase.notifications().displayNotification(notification);
    }

    public async scheduleNotification(date) {
        const notification = new firebase.notifications.Notification()
            .setNotificationId('1')
            .setTitle('Test notification')
            .setBody('This is a test notification')
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .android.setChannelId('default')
            .android.setAutoCancel(true);

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
                    // App was opened by a notification
                    // check here for different types of notifications
                    notificationHandler((notificationOpen.notification as any).data, true);
                }
            });
    }
}

export const Notifications = new NotificationService();
