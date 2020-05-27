import { HttpClient } from '../utils/http-client';
import CONFIG from '../../config';
import { encrypt } from '../secure/encrypt/encrypt.web';
import { extensionState } from './conn-ext-trim-state';
import { store } from '../../redux/config';
import { Notifications } from '../messaging/notifications/notifications';
import { IQRCodeConn, ResponsePayload } from './types';
import { sha256 } from 'js-sha256'; // maybe replace this with CryptoJS.SHA256
import { ConnectExtensionWeb } from './connect-extension-web';
import { CONN_EXTENSION } from '../constants/app';
import {
    getItemFromStorage,
    storeItemToStorage,
    deleteFromStorage
} from '../secure/storage/storage';
import { captureException } from '@sentry/browser';

const getConnectionAppStateHashKey = connectionId => `${CONN_EXTENSION}StateHash-${connectionId}`;

export const ConnectExtension = (() => {
    const syncExtension = async (connection: IQRCodeConn): Promise<any> => {
        try {
            const appState = JSON.stringify(extensionState(store.getState()));
            const appStateHash = sha256(appState);
            let latestAppStateHash = null;

            try {
                latestAppStateHash = await getItemFromStorage(
                    getConnectionAppStateHashKey(connection.connectionId)
                );
            } catch {
                // no problem, we will do an update and set this value
            }

            if (appStateHash !== latestAppStateHash) {
                const http = new HttpClient(CONFIG.extSync.updateStateUrl);
                const res = await http.post('', {
                    connectionId: connection.connectionId,
                    data: await encrypt(appState, connection.encKey),
                    authToken: sha256(connection.encKey),
                    fcmToken: await Notifications.getToken()
                });

                if (res.success) {
                    await storeItemToStorage(
                        appStateHash,
                        getConnectionAppStateHashKey(connection.connectionId)
                    );
                }

                return res;
            } else {
                return {
                    success: true,
                    code: 200
                };
            }
        } catch (e) {
            captureException(JSON.stringify(e));
        }
    };

    const disconnectExtension = async (connection: IQRCodeConn) => {
        try {
            const http = new HttpClient(CONFIG.extSync.disconnectUrl);
            await http.post('', {
                connectionId: connection.connectionId,
                authToken: sha256(connection.encKey)
            });
            await deleteFromStorage(getConnectionAppStateHashKey(connection.connectionId));
        } catch {
            //
        }
    };

    // TODO: sendRequestPayload type
    const sendRequest = async (sendRequestPayload: any) => {
        try {
            const connection: IQRCodeConn = await ConnectExtensionWeb.getConnection();

            const http = new HttpClient(CONFIG.extSync.sendRequestUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                authToken: sha256(connection.encKey),
                data: {
                    method: sendRequestPayload.method,
                    params: await encrypt(
                        JSON.stringify(sendRequestPayload.params),
                        connection.encKey
                    ),
                    notification: sendRequestPayload.notification
                }
            });

            return res;
        } catch {
            //
        }
    };

    const sendResponse = async (requestId: string, sendResponsePayload: ResponsePayload) => {
        try {
            const connection: IQRCodeConn = await ConnectExtensionWeb.getConnection();

            const http = new HttpClient(CONFIG.extSync.sendResponseUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                requestId,
                authToken: sha256(connection.encKey),
                data: {
                    result: sendResponsePayload.result && {
                        txHash: sendResponsePayload.result.txHash,
                        tx: await encrypt(
                            JSON.stringify(sendResponsePayload.result.tx),
                            connection.encKey
                        )
                    },
                    errorCode: sendResponsePayload?.errorCode
                }
            });

            return res;
        } catch {
            //
        }
    };

    const deleteRequest = async (requestId: string) => {
        try {
            const connection: IQRCodeConn = await ConnectExtensionWeb.getConnection();

            const http = new HttpClient(CONFIG.extSync.deleteRequestUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                requestId,
                authToken: sha256(connection.encKey)
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
        sendResponse,
        deleteRequest
    };
})();
