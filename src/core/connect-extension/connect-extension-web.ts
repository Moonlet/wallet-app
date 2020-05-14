import { IQRCodeConn, FirebaseRef } from './types';
import { getBaseEncryptionKey } from '../secure/keychain';
import { readEncrypted, deleteFromStorage, storeEncrypted } from '../secure/storage';
import { CONN_EXTENSION } from '../constants/app';
import { Dialog } from '../../components/dialog/dialog';
import { translate } from '../i18n';
import { ConnectExtension } from './connect-extension';
import { database } from 'react-native-firebase';
import { decrypt } from '../secure/encrypt.web';
import CryptoJS from 'crypto-js';
import { IBlockchainTransaction } from '../blockchain/types';

export const ConnectExtensionWeb = (() => {
    const getRealtimeDBConnectionsRef = () => {
        const realtimeDB = database().ref(FirebaseRef.EXTENSION_SYNC);
        return realtimeDB.child(FirebaseRef.CONNECTIONS);
    };

    const getRealtimeDBRequestsRef = () => {
        const realtimeDB = database().ref(FirebaseRef.EXTENSION_SYNC);
        return realtimeDB.child(FirebaseRef.REQUESTS);
    };

    const storeConnection = async (connection: IQRCodeConn): Promise<boolean> => {
        try {
            const res = await ConnectExtension.syncExtension(connection);

            if (res?.success === true) {
                // Extension has been connected
                // Store connection
                const keychainPassword = await getBaseEncryptionKey();
                if (keychainPassword) {
                    storeEncrypted(JSON.stringify(connection), CONN_EXTENSION, keychainPassword);
                }

                return true;
            } else {
                Dialog.info(translate('App.labels.warning'), translate('ConnectExtension.error'));
            }
        } catch {
            Dialog.info(translate('App.labels.warning'), translate('ConnectExtension.error'));
        }
    };

    const disconnect = async () => {
        try {
            const connection = await getConnection();

            if (connection) {
                ConnectExtension.disconnectExtension(connection);
            }
        } catch {
            //
        }

        // Delete connection from async storage
        await deleteFromStorage(CONN_EXTENSION);
    };

    const getConnection = async () => {
        try {
            const encryptionKey = await getBaseEncryptionKey();
            const connection = await readEncrypted(CONN_EXTENSION, encryptionKey);

            if (connection) {
                return JSON.parse(connection);
            }

            return null;
        } catch {
            //
        }
    };

    const isConnected = async (): Promise<boolean> => {
        try {
            const encryptionKey = await getBaseEncryptionKey();
            const connection = await readEncrypted(CONN_EXTENSION, encryptionKey);

            if (connection) {
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    };

    const generateQRCodeUri = async () => {
        //
    };

    const downloadFileStorage = async (connectionId: string) => {
        //
    };

    const listenLastSync = async () => {
        //
    };

    const listenLastSyncForConnect = (conn: IQRCodeConn) => {
        //
    };

    const getRequestIdParams = async (requestId: string) => {
        try {
            const requestsRef = getRealtimeDBRequestsRef();
            const dataSnap = await requestsRef
                .child(requestId)
                .child('req')
                .child('params')
                .once('value');

            const data = await dataSnap.val();

            const connection = await getConnection();

            if (connection) {
                const decrypted = JSON.parse(
                    decrypt(data, connection.encKey).toString(CryptoJS.enc.Utf8)
                );

                return decrypted[0]; // transaction
            }

            return undefined;
        } catch {
            //
        }
    };

    const listenerReqResponse = async (
        requestId: string,
        callback: (res: {
            result: { txHash: string; tx: IBlockchainTransaction };
            errorCode: string;
        }) => void
    ) => {
        //
    };

    const isConnectionIdStoredFirebase = async (): Promise<boolean> => {
        try {
            const connection = await getConnection();

            if (connection) {
                const connectionsRef = getRealtimeDBConnectionsRef();
                const dataSnap = await connectionsRef.child(connection.connectionId).once('value');

                return dataSnap.exists();
            } else {
                return Promise.reject();
            }
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        storeConnection,
        disconnect,
        getConnection,
        isConnected,
        generateQRCodeUri,
        downloadFileStorage,
        listenLastSync,
        listenLastSyncForConnect,
        getRequestIdParams,
        listenerReqResponse,
        isConnectionIdStoredFirebase
    };
})();
