export const WalletConnectWeb = (() => {
    const connect = () => {
        return Promise.resolve();
    };

    const subscribe = (eventName, callback) => {
        return () => {
            // @ts-ignore
        };
    };

    const isConnected = () => true;

    const disconnect = () => {
        // @ts-ignore
    };

    return {
        connect,
        disconnect,
        subscribe,
        isConnected
    };
})();
