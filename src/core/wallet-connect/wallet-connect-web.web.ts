// import WalletConnect from '@walletconnect/browser';
import { WC } from '../constants/app';
// import { updateReduxState } from '../../redux/wallets/actions';
import { WebStorage } from './wc-web-storage';
import Connector from '@walletconnect/core';
import * as cryptoLib from '@walletconnect/browser/src/webCrypto';
import { setExtensionStateLoaded } from '../../redux/ui/extension/actions';
import { merge } from 'lodash';

// TODO: remove this
export const WalletConnectWeb = (() => {
    let store = null;
    const subscribers = [];

    const walletConnector = new Connector(
        cryptoLib,
        {
            bridge: 'https://bridge.walletconnect.org'
        },
        null,
        WebStorage
    );

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
                const state = merge(store.getState(), payload.params[0]);

                // store.dispatch(updateReduxState(state));
                walletConnector.approveRequest({ id: payload.id, result: { state } });
                break;

            case WC.PING:
                walletConnector.approveRequest({ id: payload.id, result: { status: 'ok' } });
                break;

            default:
                walletConnector.rejectRequest({
                    id: payload.id,
                    error: { message: `Unknown method ` + JSON.stringify(payload) }
                });
        }
    });

    const isConnected = () => walletConnector.connected;

    const disconnect = () => walletConnector && walletConnector.killSession();

    const getState = () => {
        return new Promise((resolve, reject) => {
            let i = 0;
            const timer = setInterval(
                (function connectorGetState() {
                    i++;
                    walletConnector
                        .sendCustomRequest(
                            { method: WC.GET_STATE },
                            { forcePushNotification: true }
                        )
                        .then(data => {
                            clearInterval(timer);
                            store.dispatch(setExtensionStateLoaded());
                            if (data.error) {
                                alert(data.error);
                                reject(data.error);
                            } else {
                                const state = merge(store.getState(), data.state);
                                state.app.extensionStateLoaded = true;
                                // store.dispatch(updateReduxState(state));
                                resolve(data);
                            }
                        });

                    if (i > 3) {
                        clearInterval(timer);
                    }
                    return connectorGetState;
                })(),
                5000
            );
        });
    };

    const signTransaction = transactionData => {
        return new Promise((resolve, reject) => {
            walletConnector
                .sendCustomRequest(
                    { method: WC.SIGN_TRANSACTION, params: [transactionData] },
                    { forcePushNotification: true }
                )
                .then(data => {
                    if (data.error) {
                        reject(data.error);
                    } else {
                        resolve(data);
                    }
                })
                .catch(error => {
                    reject(error);
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
        setStore,
        signTransaction
    };
})();
