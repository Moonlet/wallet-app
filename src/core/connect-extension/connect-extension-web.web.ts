import { generateRandomEncryptionKey, decrypt } from '../secure/encrypt.web';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { IQRCodeConn, FirebaseRef, FIREBASE_BUCKET } from './types';
import { storage, database } from 'firebase';
import { updateReduxState } from '../../redux/wallets/actions';
import { setExtensionStateLoaded } from '../../redux/ui/extension/actions';
import { merge } from 'lodash';
// import { browser } from 'webextension-polyfill-ts';

export class ConnectExtensionWeb {
    public store: any = null;
    public isConnected: boolean = false;

    public connect(decryptedState: any) {
        // console.log('store: ', this.store);
        // console.log('connect decryptedState: ', decryptedState);

        try {
            this.store.dispatch(setExtensionStateLoaded());

            const state = merge(this.store.getState(), decryptedState);
            // console.log('state: ', state);
            state.app.extensionStateLoaded = true;
            this.store.dispatch(updateReduxState(state));

            // console.log('store: ', this.store);

            this.isConnected = true;

            return;
        } catch (err) {
            // console.log('ERR:', err);
        }
    }

    public disconnect() {
        this.isConnected = false;
        // TODO
    }

    public getIsConnected() {
        return this.isConnected;
    }

    public getState() {
        //
    }

    public setStore(storeReference: any) {
        this.store = storeReference;
    }

    // private async getPlatformOS() {
    //     const platformInfo = await browser.runtime.getPlatformInfo();
    //     let os: string = undefined;

    //     switch (platformInfo.os) {
    //         case 'mac':
    //             os = 'Mac'; // encodeURI('Mac OS');
    //             break;
    //         case 'win':
    //             os = 'Windows';
    //             break;
    //         case 'linux':
    //             os = 'Linux';
    //             break;
    //         case 'android':
    //             os = 'Android';
    //             break;
    //         default:
    //             break;
    //     }

    //     return os;
    // }

    public async generateQRCodeUri(): Promise<{ uri: string; conn: IQRCodeConn }> {
        const conn: IQRCodeConn = {
            connectionId: uuidv4(),
            encKey: generateRandomEncryptionKey().toString(CryptoJS.enc.Base64),
            os: encodeURIComponent('Mac OS'),
            platform: 'Chrome' // TODO
        };

        let uri = 'mooonletExtSync:' + conn.connectionId + '@firebase' + '/?encKey=' + conn.encKey;
        if (conn.os) {
            uri = uri + '&os=' + conn.os;
        }
        if (conn.platform) {
            uri = uri + '&browser=' + conn.platform;
        }

        return { uri, conn };
    }

    public async downloadFileStorage(connectionId: string): Promise<string> {
        try {
            // Download file from Firebase Storage - State
            const urlDowndload = await storage()
                .refFromURL(FIREBASE_BUCKET)
                .child(connectionId)
                .getDownloadURL();

            const http = await fetch(urlDowndload);
            const data = await http.text();
            const res = data.toString();

            return res.toString();
        } catch {
            Promise.reject();
        }
    }

    public async listenLastSync(conn: IQRCodeConn) {
        // RealtimeDB
        const realtimeDB = database().ref(FirebaseRef.EXTENSION_SYNC);
        const connections = realtimeDB.child(FirebaseRef.CONNECTIONS);
        connections.child(conn.connectionId).on('value', async (snapshot: any) => {
            const snap = snapshot.val();

            if (snap?.lastSynced && snap?.authToken) {
                try {
                    // Extension the state from Firebase Storage
                    const extState = await this.downloadFileStorage(conn.connectionId);

                    if (extState) {
                        // const encKey1 = snap.authToken;
                        // console.log('encKey: ', encKey1);

                        const decryptedState = JSON.parse(
                            decrypt(extState, conn.encKey).toString(CryptoJS.enc.Utf8)
                        );

                        // Save state
                        // console.log('decryptedState: ', decryptedState);
                        this.connect(decryptedState);

                        return decryptedState;
                    } else {
                        //
                    }
                } catch (err) {
                    // console.log('EROARE: ', err);
                    Promise.reject();
                }
            } else {
                // Connection does not exist! Waiting for connections...
                // console.log('Connection does not exist! Waiting for connections...');
            }
        });
    }
}
