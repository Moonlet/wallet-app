import { IQRCodeConn } from './types';
import { getBaseEncryptionKey } from '../secure/keychain';
import { readEncrypted, deleteFromStorage } from '../secure/storage';
import { CONN_EXTENSION } from '../constants/app';

export const ConnectExtensionWeb = (() => {
    const storeConnection = async (conn: IQRCodeConn) => {
        //
    };

    const disconnect = async () => {
        try {
            const connection = await ConnectExtensionWeb.getConnection();

            if (connection) {
                this.connectExtension.disconnectExtension(connection);
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
