import { HttpClient } from '../utils/http-client';
import CONFIG from '../../config/config-beta';
import { encrypt } from '../secure/encrypt.web';
import { extensionState } from './conn-ext-trim-state';
import { store } from '../../redux/config';
import { Notifications } from '../messaging/notifications/notifications';
import { IQRCodeConn } from './types';
import { sha256 } from 'js-sha256'; // maybe replace this with CryptoJS.SHA256

export class ConnectExtension {
    public async syncExtension(connection: IQRCodeConn): Promise<any> {
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
            //
        }
    }
}
