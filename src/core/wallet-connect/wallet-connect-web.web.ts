import WalletConnect from '@walletconnect/browser';
import { WC } from '../constants/app';
import { updateReduxState } from '../../redux/wallets/actions';

export const WalletConnectWeb = (() => {
    let store = null;
    const subscribers = [];

    const walletConnector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org'
    });

    const setStore = storeReference => {
        store = storeReference;
    };

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

    // custom calls used by moonlet
    walletConnector.on('call_request', (error, payload) => {
        if (error) {
            throw error;
        }

        switch (payload.method) {
            case WC.UPDATE_STATE:
                const state = Object.assign(store.getState(), payload.params[0]);

                store.dispatch(updateReduxState(state));
                walletConnector.approveRequest({ id: payload.id, result: { state } });
                break;

            default:
                walletConnector.rejectRequest({
                    id: payload.id,
                    error: { message: 'Unknown method' }
                });
        }
    });

    const isConnected = () => walletConnector.connected;

    const disconnect = () => walletConnector && walletConnector.killSession();

    const getState = () => {
        return new Promise((resolve, reject) => {
            walletConnector.sendCustomRequest({ method: WC.GET_STATE }).then(data => {
                if (data.error) {
                    alert(data.error);
                    reject(data.error);
                } else {
                    const state = Object.assign(store.getState(), data.state);
                    store.dispatch(updateReduxState(state));
                    resolve(data);
                }
            });
        });
    };

    walletConnector.on('connect', (error, payload) => {
        publish('connect', payload);
    });

    walletConnector.on('session_update', (error, payload) => {
        publish('session_update', payload);
    });

    const getSession = () => {
        return walletConnector.session;
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

    return {
        connect,
        disconnect,
        subscribe,
        isConnected,
        getState,
        getSession,
        setStore
    };
})();
