import WalletConnect from '@walletconnect/browser';

export const WalletConnectWeb = (() => {
    const walletConnector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org'
    });

    const subscribers = [];

    const connect = () => {
        return new Promise(resolve => {
            if (walletConnector.connected) {
                resolve(walletConnector.uri);
            } else {
                walletConnector.createSession().then(() => {
                    resolve(walletConnector.uri);
                });
            }
        });
    };

    const subscribe = (eventName, callback) => {
        if (!Array.isArray(subscribers[eventName])) {
            subscribers[eventName] = [];
        }
        subscribers[eventName].push(callback);
        const index = subscribers[eventName].length - 1;

        return () => {
            subscribers[eventName].splice(index, 1);
        };
    };

    const publish = (eventName, data) => {
        if (!Array.isArray(subscribers[eventName])) {
            return;
        }
        subscribers[eventName].forEach(callback => {
            callback(data);
        });
    };

    const isConnected = () => walletConnector.connected;

    const disconnect = () => walletConnector.killSession();

    // subscribe to wallet connect events
    walletConnector.on('connect', (error, payload) => {
        publish('connect', payload);
    });

    walletConnector.on('session_update', (error, payload) => {
        publish('session_update', payload);
    });

    return {
        connect,
        disconnect,
        subscribe,
        isConnected
    };
})();
