import { HttpClient } from '../utils/http-client';
import CONFIG from '../../config/config-beta';
import { encrypt } from '../secure/encrypt';
import { extensionState } from './conn-ext-state-helper';
import { store } from '../../redux/config';
import { Notifications } from '../messaging/notifications/notifications';
import { IQRCode } from './types';
import { sha256 } from 'js-sha256';

export class ConnectExtension {
    public async syncExtension(connection: IQRCode): Promise<any> {
        try {
            const http = new HttpClient(CONFIG.extSyncUpdateStateUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                data: await encrypt(
                    JSON.stringify(extensionState(store.getState())),
                    connection.encKey
                ),
                authToken: sha256(connection.encKey),
                fcmToken: await Notifications.getToken()
            });

            return res;
        } catch {
            Promise.reject();
        }
    }

    public async disconnectExtension(connection: any) {
        try {
            const connectionParse = JSON.parse(connection);
            const connectionId = connectionParse.connectionId;
            const authToken = connectionParse.encKey;

            const http = new HttpClient(CONFIG.extSyncDisconnectUrl);
            await http.post('', {
                connectionId,
                authToken: sha256(authToken)
            });
        } catch {
            Promise.reject();
        }
    }
}
