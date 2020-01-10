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
    const setStore = store => true;

    const disconnect = () => {
        // @ts-ignore
    };

    const getState = () => {
        return Promise.resolve();
    };

    return {
        connect,
        disconnect,
        subscribe,
        isConnected,
        setStore,
        getState
    };
})();
