import RNWalletConnect from '@walletconnect/react-native';
import { getPassword } from '../secure/keychain';
import { storeEncrypted, readEncrypted } from '../secure/storage';
import { WC_CONNECTION, WC } from '../constants/app';
import { trimState } from './wc-state-helper';

const moonletMeta: any = {
    clientMeta: {
        description: 'Moonlet Wallet App',
        url: 'https://moonlet.xyz/',
        name: 'Moonlet',
        // @ts-ignore
        ssl: true
    }
};

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
    const connect = (connectionString: string) => {
        walletConnector && walletConnector.killSession;

        walletConnector = new RNWalletConnect(
            {
                uri: connectionString
            },
            moonletMeta
        );

        setupListeners();
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
                            .then(conn => {
                                walletConnector && walletConnector.killSession;
                                walletConnector = new RNWalletConnect(
                                    { session: JSON.parse(conn) },
                                    moonletMeta
                                );
                                // const s =  'wc:392af13b-cc1e-4ed4-b146-89581bc92ceb@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=292b21f07f145499434daa636df3be4193bfc4f29a5f6f5a9ea9ca78080fbe4f';
                                // walletConnector = new RNWalletConnect(
                                //     { uri: s },
                                //     moonletMeta
                                // );
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

    reconnect().catch(() => {
        // not connected
    });

    return {
        connect,
        reconnect,
        disconnect,
        sendMessage,
        setStore,
        isConnected
    };
})();
