function notifications() {
    return {
        onNotification: jest.fn(),
        onNotificationDisplayed: jest.fn(),
        android: {
            createChannel: jest.fn()
        }
    };
}

notifications.Android = {
    Channel: jest.fn(),
    Importance: {
        Max: 5
    }
};

export default {
    messaging: jest.fn(() => ({
        hasPermission: jest.fn(() => Promise.resolve(true)),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
        requestPermission: jest.fn(() => Promise.resolve(true)),
        getToken: jest.fn(() => Promise.resolve('myMockToken'))
    })),
    notifications,
    analytics: jest.fn(() => ({
        logEvent: jest.fn()
    }))
};
