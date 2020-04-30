import { generateRandomEncryptionKey, decrypt } from '../secure/encrypt.web';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { IQRCodeConn, FirebaseRef, FIREBASE_BUCKET } from './types';
import { storage, database } from 'firebase';
import { updateReduxState } from '../../redux/wallets/actions';
import { setExtensionStateLoaded } from '../../redux/ui/extension/actions';
import { merge } from 'lodash';
import { storeEncrypted, readEncrypted, deleteFromStorage } from '../../core/secure/storage.web';
import { CONN_EXTENSION } from '../../core/constants/app';
import Bowser from 'bowser';

export const ConnectExtensionWeb = (() => {
    let store: any = null;

    const storeConnection = async (conn: IQRCodeConn) => {
        try {
            const encKey = generateRandomEncryptionKey().toString(CryptoJS.enc.Base64);

            if (encKey) {
                // store session
                await storeEncrypted(JSON.stringify(conn), CONN_EXTENSION, encKey);
            }
        } catch {
            Promise.reject();
        }
    };

    const disconnect = async (): Promise<void> => {
        try {
            // delete the connection session
            await deleteFromStorage(CONN_EXTENSION);
        } catch {
            Promise.reject();
        }
    };

    const getConnection = async (): Promise<any> => {
        try {
            const encKey = generateRandomEncryptionKey().toString(CryptoJS.enc.Base64);
            const stored = await readEncrypted(CONN_EXTENSION, encKey);

            return stored;
        } catch (err) {
            Promise.reject(err);
        }
    };

    const isConnected = async (): Promise<boolean> => {
        try {
            const conn = await getConnection();
            if (conn) {
                return true;
            } else {
                return false;
            }
        } catch {
            //
        }
    };

    const getState = () => {
        return store && store.getState();
    };

    const storeState = (decryptedState: any) => {
        // console.log('decryptedState: ', decryptedState);

        try {
            store.dispatch(setExtensionStateLoaded());
            const state = merge(store.getState(), decryptedState.state); // TODO: check - decryptedState.state
            state.app.extensionStateLoaded = true;
            store.dispatch(updateReduxState(state));
            return;
        } catch {
            //
        }
    };

    const setStore = (storeReference: any) => {
        store = storeReference;
    };

    const generateQRCodeUri = async (): Promise<{ uri: string; conn: IQRCodeConn }> => {
        const browser = Bowser.getParser(window.navigator.userAgent);

        const conn: IQRCodeConn = {
            connectionId: uuidv4(),
            encKey: generateRandomEncryptionKey().toString(CryptoJS.enc.Base64),
            os: browser.getOSName(),
            platform: browser.getBrowserName()
        };

        let uri = 'mooonletExtSync:' + conn.connectionId + '@firebase' + '/?encKey=' + conn.encKey;
        if (conn.os) {
            uri = uri + '&os=' + conn.os;
        }
        if (conn.platform) {
            uri = uri + '&browser=' + conn.platform;
        }

        return { uri, conn };
    };

    const downloadFileStorage = async (connectionId: string): Promise<string> => {
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
    };

    const listenLastSync = async (conn: IQRCodeConn) => {
        // RealtimeDB
        const realtimeDB = database().ref(FirebaseRef.EXTENSION_SYNC);
        const connections = realtimeDB.child(FirebaseRef.CONNECTIONS);
        connections.child(conn.connectionId).on('value', async (snapshot: any) => {
            const snap = snapshot.val();

            if (snap?.lastSynced && snap?.authToken) {
                try {
                    // Extension the state from Firebase Storage
                    const extState = await downloadFileStorage(conn.connectionId);

                    if (extState) {
                        const decryptedState = JSON.parse(
                            decrypt(extState, conn.encKey).toString(CryptoJS.enc.Utf8)
                        );

                        // Save state
                        storeState(decryptedState);

                        // Store connection
                        await storeConnection(conn);

                        return decryptedState;
                    } else {
                        //
                    }
                } catch (err) {
                    Promise.reject(err);
                }
            } else {
                // Connection does not exist! Waiting for connections...
            }
        });
    };

    return {
        storeConnection,
        disconnect,
        getConnection,
        isConnected,
        getState,
        storeState,
        setStore,
        generateQRCodeUri,
        downloadFileStorage,
        listenLastSync
    };
})();
