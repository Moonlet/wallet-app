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
import { browser } from 'webextension-polyfill-ts';
import { buildState } from './conn-ext-build-state/conn-ext-build-state';
import { store } from '../../redux/config';
import { openLoadingModal, closeLoadingModal } from '../../redux/ui/loading-modal/actions';
import { NavigationService } from '../../navigation/navigation-service';

export const ConnectExtensionWeb = (() => {
    const storeConnection = async (conn: IQRCodeConn) => {
        try {
            // store session
            await storeEncrypted(JSON.stringify(conn), CONN_EXTENSION, CONN_EXTENSION);
        } catch {
            Promise.reject();
        }
    };

    const disconnect = async (): Promise<void> => {
        // delete store ?
        try {
            // delete the connection session
            await deleteFromStorage(CONN_EXTENSION);
        } catch {
            Promise.reject();
        }
    };

    const getConnection = async (): Promise<any> => {
        try {
            const stored = await readEncrypted(CONN_EXTENSION, CONN_EXTENSION);
            return stored;
        } catch (err) {
            Promise.reject(err);
        }
    };

    // TODO: maybe find a better way to check this
    // it would help if it's not a promise because Dashboard is loading
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

    const getPlatformOS = async (): Promise<string> => {
        const platformInfo = await browser.runtime.getPlatformInfo();
        let os: string;

        switch (platformInfo.os) {
            case 'mac':
                os = encodeURIComponent('Mac OS');
                break;
            case 'win':
                os = 'Windows';
                break;
            case 'linux':
                os = 'Linux';
                break;
            case 'android':
                os = 'Android';
                break;
            default:
                break;
        }

        return os;
    };

    const generateQRCodeUri = async (): Promise<{ uri: string; conn: IQRCodeConn }> => {
        const conn: IQRCodeConn = {
            connectionId: uuidv4(),
            encKey: generateRandomEncryptionKey().toString(CryptoJS.enc.Base64),
            os: await getPlatformOS(),
            platform: Bowser.getParser(window.navigator.userAgent).getBrowserName()
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
            return (await http.text()).toString();
        } catch {
            Promise.reject();
        }
    };

    /**
     * Build extension state
     */
    const storeState = async (decryptedState: any) => {
        try {
            const extState = await buildState(decryptedState);
            const state = merge(store.getState(), extState);
            state.app.extensionStateLoaded = true;
            store.dispatch(updateReduxState(state) as any);
            store.dispatch(setExtensionStateLoaded());
            return;
        } catch {
            //
        }
    };

    const listenLastSync = (conn: IQRCodeConn) => {
        // RealtimeDB
        const realtimeDB = database().ref(FirebaseRef.EXTENSION_SYNC);
        const connections = realtimeDB.child(FirebaseRef.CONNECTIONS);
        connections.child(conn.connectionId).on('value', async (snapshot: any) => {
            const snap = snapshot.val();

            if (snap?.lastSynced && snap?.authToken) {
                // show loading untill data is fetch and state is build
                store.dispatch(openLoadingModal());

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

                        // remove listener for connectionId
                        connections.child(conn.connectionId).off('value');

                        // navigate to Dashboard
                        NavigationService.navigate('MainNavigation', {});
                    }

                    // close loading modal
                    store.dispatch(closeLoadingModal() as any);
                } catch (err) {
                    store.dispatch(closeLoadingModal() as any);
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
        generateQRCodeUri,
        downloadFileStorage,
        listenLastSync
    };
})();
