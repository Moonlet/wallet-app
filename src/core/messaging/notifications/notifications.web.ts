export class NotificationService {
    public async getToken() {
        return Promise.resolve('');
    }

    public configure() {
        return null;
    }

    public displayNotification(title, body, data) {
        return null;
    }

    public removeListeners() {
        return null;
    }
}

export const Notifications = new NotificationService();
