import { IQRCodeConn } from './types';
import { getBaseEncryptionKey } from '../secure/keychain';
import { readEncrypted, deleteFromStorage, storeEncrypted } from '../secure/storage';
import { CONN_EXTENSION } from '../constants/app';
import { Dialog } from '../../components/dialog/dialog';
import { translate } from '../i18n';
import { ConnectExtension } from './connect-extension';

export const ConnectExtensionWeb = (() => {
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
            ConnectExtension.disconnectExtension();
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

    return {
        storeConnection,
        disconnect,
        getConnection,
        isConnected,
        generateQRCodeUri,
        downloadFileStorage,
        listenLastSync,
        listenLastSyncForConnect
    };
})();
