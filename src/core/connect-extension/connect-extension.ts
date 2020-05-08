import { HttpClient } from '../utils/http-client';
import CONFIG from '../../config/config-beta';
import { encrypt } from '../secure/encrypt.web';
import { extensionState } from './conn-ext-trim-state';
import { store } from '../../redux/config';
import { Notifications } from '../messaging/notifications/notifications';
import { IQRCodeConn } from './types';
import { sha256 } from 'js-sha256'; // maybe replace this with CryptoJS.SHA256
import { ConnectExtensionWeb } from './connect-extension-web';
import { IBlockchainTransaction } from '../blockchain/types';

export const ConnectExtension = (() => {
    const syncExtension = async (connection: IQRCodeConn): Promise<any> => {
        try {
            const http = new HttpClient(CONFIG.extSyncUpdateStateUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                data: encrypt(JSON.stringify(extensionState(store.getState())), connection.encKey),
                authToken: sha256(connection.encKey),
                fcmToken: await Notifications.getToken()
            });

            return res;
        } catch {
            //
        }
    };

    const disconnectExtension = async (connection: IQRCodeConn) => {
        try {
            const http = new HttpClient(CONFIG.extSyncDisconnectUrl);
            await http.post('', {
                connectionId: connection.connectionId,
                authToken: sha256(connection.encKey)
            });
        } catch {
            //
        }
    };

    // TODO: sendRequestPayload type
    const sendRequest = async (sendRequestPayload: any) => {
        try {
            const connection: IQRCodeConn = await ConnectExtensionWeb.getConnection();

            const http = new HttpClient(CONFIG.extSyncSendRequestUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                authToken: sha256(connection.encKey),
                data: {
                    method: sendRequestPayload.method,
                    params: encrypt(JSON.stringify(sendRequestPayload.params), connection.encKey),
                    notification: sendRequestPayload.notification
                }
            });

            return res;
        } catch {
            //
        }
    };

    const sendResponse = async (
        requestId: string,
        sendResponsePayload: { txHash: string; tx: IBlockchainTransaction }
    ) => {
        try {
            const connection: IQRCodeConn = await ConnectExtensionWeb.getConnection();

            const http = new HttpClient(CONFIG.extSyncSendResponseUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                requestId,
                authToken: sha256(connection.encKey),
                data: {
                    txHash: sendResponsePayload.txHash,
                    tx: encrypt(JSON.stringify(sendResponsePayload.tx), connection.encKey)
                }
            });

            return res;
        } catch {
            //
        }
    };

    return {
        syncExtension,
        disconnectExtension,
        sendRequest,
        sendResponse
    };
})();
