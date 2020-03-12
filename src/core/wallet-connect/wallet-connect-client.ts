import RNWalletConnect from '@walletconnect/react-native';
import { getPassword } from '../secure/keychain';
import { storeEncrypted, readEncrypted } from '../secure/storage';
import { WC_CONNECTION, WC } from '../constants/app';
import { trimState } from './wc-state-helper';
import { Notifications } from '../messaging/notifications/notifications';
import { AppState, Platform } from 'react-native';
import { signExtensionTransaction } from './utils';
import { formatNumber } from '../utils/format-number';
import { getBlockchain } from '../blockchain/blockchain-factory';
import BigNumber from 'bignumber.js';
import { formatAddress } from '../utils/format-address';
import { getApnsToken } from '../messaging/silent/ios-voip-push-notification';
import { NotificationType } from '../messaging/types';

import BackgroundTimer from 'react-native-background-timer';

const clientMeta: any = {
    description: 'Moonlet Wallet App',
    url: 'https://moonlet.xyz/',
    name: 'Moonlet',
    // @ts-ignore
    ssl: true
};

const getDeviceToken = () =>
    Platform.OS === 'android' ? Notifications.getToken() : getApnsToken();

export const WalletConnectClient = (() => {
    let walletConnector: RNWalletConnect;
    let store = null;

    // save a reference to Redux store
    const setStore = storeReference => {
        store = storeReference;
    };

    // store encrypted the connection data for reconnecting later
    const storeConnection = async () => {
        const keychainPassword = await getPassword();
        if (keychainPassword) {
            storeEncrypted(
                JSON.stringify(walletConnector.session),
                WC_CONNECTION,
                keychainPassword.password
            );
        }
    };

    // initiate new connection using the connection string (from QR code)
    const connect = async (connectionString: string) => {
        walletConnector && walletConnector.killSession();

        walletConnector = new RNWalletConnect(
            {
                uri: connectionString
            },
            {
                clientMeta,
                push: {
                    url:
                        'https://us-central1-moonlet-wallet-dev.cloudfunctions.net/walletConnectPush',
                    type: Platform.OS === 'android' ? 'fcm' : 'apn',
                    token: await getDeviceToken(),
                    peerMeta: true,
                    language: 'en'
                }
            }
        );

        setupListeners();
    };

    const checkConnection = () => {
        // reconnect if no response from extension in 2000ms
        const timeoutId = BackgroundTimer.setTimeout(() => {
            reconnect();
        }, 2000);

        walletConnector
            .sendCustomRequest({ method: WC.PING })
            .then(() => {
                BackgroundTimer.clearTimeout(timeoutId);
            })
            .catch(e => {
                BackgroundTimer.clearTimeout(timeoutId);
            });
    };

    // register listeners to respone to wc events
    const setupListeners = () => {
        // called during handshake
        walletConnector.on('session_request', (error, payload) => {
            if (error) {
                throw error;
            }

            walletConnector.approveSession({
                accounts: ['0x1b6c705252438d59DB3ADB85e3B91374377a20c9'],
                chainId: 1 // required
            });

            storeConnection();
        });

        // custom calls used by moonlet
        walletConnector.on('call_request', (error, payload) => {
            if (error) {
                throw error;
            }

            switch (payload.method) {
                case WC.GET_STATE:
                    const state = trimState(store.getState());
                    walletConnector.approveRequest({ id: payload.id, result: { state } });
                    break;
                case WC.SIGN_TRANSACTION:
                    if (AppState.currentState !== 'active') {
                        // app is in background or was wake up by background service > display a notification
                        const { account, toAddress, amount } = payload.params[0];
                        const formattedAmount = formatNumber(new BigNumber(amount), {
                            currency: getBlockchain(account.blockchain).config.coin
                        });
                        Notifications.displayNotification(
                            'Moonlet',
                            `New transaction request of ${formattedAmount} from ${formatAddress(
                                account.address,
                                account.blockchain
                            )} to ${formatAddress(toAddress, account.blockchain)}`,
                            {
                                type: NotificationType.EXTENSION_TRANSACTION,
                                data: payload
                            }
                        );
                    } else {
                        signExtensionTransaction(payload);
                    }
                    break;
            }
        });

        walletConnector.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }
        });
    };

    const reconnect = () => {
        return new Promise((resolve, reject) => {
            getPassword()
                .then(keychainPassword => {
                    if (keychainPassword) {
                        readEncrypted(WC_CONNECTION, keychainPassword.password)
                            .then(async conn => {
                                walletConnector && walletConnector.killSession();
                                walletConnector = new RNWalletConnect(
                                    { session: JSON.parse(conn) },
                                    {
                                        clientMeta,
                                        push: {
                                            url:
                                                'https://us-central1-moonlet-wallet-dev.cloudfunctions.net/walletConnectPush',
                                            type: Platform.OS === 'android' ? 'fcm' : 'apn',
                                            token: await Notifications.getToken(),
                                            peerMeta: true,
                                            language: 'en'
                                        }
                                    }
                                );
                                setupListeners();
                            })
                            .catch(e => {
                                reject('Could not load connection info');
                            });
                    } else {
                        reject('Could not load connection info');
                    }
                })
                .catch(e => {
                    reject('Could not load connection info');
                });
        });
    };

    // sends data to extension
    const sendMessage = (method: string, payload: any) => {
        if (!isConnected()) {
            return Promise.reject('Not connected');
        }

        return new Promise((resolve, reject) => {
            walletConnector.sendCustomRequest({ method, params: [payload] }).then(data => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data.result);
                }
            });
        });
    };

    const isConnected = () => walletConnector && walletConnector.connected;

    const disconnect = () => {
        walletConnector && walletConnector.killSession();
    };

    const getConnector = () => walletConnector;

    reconnect().catch(() => {
        // not connected
    });

    return {
        connect,
        reconnect,
        disconnect,
        sendMessage,
        setStore,
        isConnected,
        getConnector,
        checkConnection
    };
})();
