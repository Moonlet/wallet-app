import { generateRandomEncryptionKey, decrypt } from '../secure/encrypt/encrypt.extension';
import { v4 as uuidv4 } from 'uuid';
import { IQRCodeConn, FirebaseRef, IStorage } from './types';
import { database, storage } from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import {
    storeEncrypted,
    readEncrypted,
    deleteFromStorage
} from '../secure/storage/storage.extension';
import { CONN_EXTENSION, CONN_EXT_RETRY_ATTEMPTS } from '../../core/constants/app';
import Bowser from 'bowser';
import { browser } from 'webextension-polyfill-ts';
import { buildState } from './conn-ext-build-state/conn-ext-build-state';
import { store } from '../../redux/config';
import { NavigationService } from '../../navigation/navigation-service';
import { extensionReduxUpdateState } from '../../redux/app/actions';
import { IBlockchainTransaction } from '../blockchain/types';
import { buildTransactions } from './conn-ext-build-state/build-transactions';
import { LoadingModal } from '../../components/loading-modal/loading-modal';
import CONFIG from '../../config';
import * as Sentry from '@sentry/browser';

let syncConnAttempts = 0;

export const ConnectExtensionWeb = (() => {
    const getRealtimeDBConnectionsRef = () => {
        const realtimeDB = database().ref(FirebaseRef.EXTENSION_SYNC);
        return realtimeDB.child(FirebaseRef.CONNECTIONS);
    };

    const getRealtimeDBRequestsRef = () => {
        const realtimeDB = database().ref(FirebaseRef.EXTENSION_SYNC);
        return realtimeDB.child(FirebaseRef.REQUESTS);
    };

    const storeConnection = async (conn: IQRCodeConn): Promise<void> => {
        try {
            // store session
            await storeEncrypted(JSON.stringify(conn), CONN_EXTENSION, CONN_EXTENSION);

            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const disconnect = async (): Promise<void> => {
        // delete store ?
        try {
            // delete the connection session
            await deleteFromStorage(CONN_EXTENSION);

            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getConnection = async (): Promise<IQRCodeConn> => {
        try {
            const stored = await readEncrypted(CONN_EXTENSION, CONN_EXTENSION);
            if (stored) {
                return JSON.parse(stored);
            }

            return undefined;
        } catch (err) {
            return Promise.reject(err);
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
            encKey: await generateRandomEncryptionKey(),
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
                .refFromURL(CONFIG.extSync.bucket)
                .child(connectionId)
                .getDownloadURL();

            const http = await fetch(urlDowndload);
            return (await http.text()).toString();
        } catch (err) {
            Sentry.captureException(new Error(JSON.stringify(err)));
            return Promise.reject();
        }
    };

    /**
     * Build extension state
     */
    const storeState = async (decryptedState: IStorage) => {
        try {
            const extState = await buildState(decryptedState);
            store.dispatch(extensionReduxUpdateState(extState) as any);
            // extensionStateLoaded check if needed
        } catch (err) {
            Sentry.captureException(new Error(JSON.stringify(err)));
        }
    };

    const listenLastSync = async () => {
        try {
            const connection = await getConnection();

            const connectionsRef = getRealtimeDBConnectionsRef();

            if (connection && connection?.connectionId) {
                connectionsRef.child(connection.connectionId).on('value', async (snapshot: any) => {
                    const snap = snapshot.val();

                    if (snap?.lastSynced && snap?.authToken) {
                        try {
                            // Extension the state from Firebase Storage
                            const extState = await downloadFileStorage(connection.connectionId);

                            if (extState) {
                                const decryptedState = JSON.parse(
                                    await decrypt(extState, connection.encKey)
                                );

                                // Save state
                                storeState(decryptedState);

                                // Build wallets transactions
                                buildTransactions(decryptedState.state.wallets);
                            }
                        } catch (err) {
                            Sentry.captureException(new Error(JSON.stringify(err)));
                        }
                    } else {
                        // Connection does not exist!
                    }
                });
            }
        } catch {
            //
        }
    };

    const syncConnect = async (conn: IQRCodeConn, connectionsRef: any) => {
        // show loading untill data is fetch and state is build
        await LoadingModal.open();

        try {
            // Extension the state from Firebase Storage
            const extState = await downloadFileStorage(conn.connectionId);

            if (extState) {
                const decryptedState = JSON.parse(await decrypt(extState, conn.encKey));

                // Save state
                await storeState(decryptedState);

                // Store connection
                await storeConnection(conn);

                // remove listener for connectionId
                connectionsRef.child(conn.connectionId).off('value');

                // navigate to Dashboard
                NavigationService.navigate('MainNavigation', {});

                buildTransactions(decryptedState.state.wallets);
            } else {
                if (syncConnAttempts <= CONN_EXT_RETRY_ATTEMPTS) {
                    // Retry
                    syncConnect(conn, connectionsRef);
                }
            }

            // close loading modal
            await LoadingModal.close();

            // Reset sync conn attempts
            syncConnAttempts = 0;
        } catch (err) {
            await LoadingModal.close();
            Sentry.captureException(new Error(JSON.stringify(err)));

            Sentry.addBreadcrumb({
                message: JSON.stringify({ 'attempts: ': syncConnAttempts })
            });

            syncConnAttempts += 1;

            // Retry
            syncConnect(conn, connectionsRef);
        }
    };

    const listenLastSyncForConnect = (conn: IQRCodeConn) => {
        const connectionsRef = getRealtimeDBConnectionsRef();

        connectionsRef.child(conn.connectionId).on(
            'value',
            async (snapshot: any) => {
                const snap = snapshot.val();

                if (snap?.lastSynced && snap?.authToken) {
                    syncConnect(conn, connectionsRef);
                } else {
                    // Connection does not exist! Waiting for connections...
                }
            },
            (error: any) => {
                Sentry.captureException(new Error(JSON.stringify(error)));

                Sentry.addBreadcrumb({
                    message: JSON.stringify({ 'attempts: ': syncConnAttempts })
                });

                syncConnAttempts += 1;

                // Error, try again
                connectionsRef
                    .child(conn.connectionId)
                    .off('value', () => listenLastSyncForConnect(conn));
            }
        );
    };

    const getRequestIdParams = async (requestId: string): Promise<any> => {
        //
    };

    const listenerReqResponse = async (
        requestId: string,
        callback: (res: {
            result: { txHash: string; tx: IBlockchainTransaction };
            errorCode: string;
        }) => void
    ) => {
        try {
            const connection = await getConnection();

            const requestsRef = getRealtimeDBRequestsRef();
            requestsRef
                .child(requestId)
                .child('res')
                .on('value', async (snapshot: any) => {
                    if (snapshot.exists()) {
                        const snap = await snapshot.val();

                        const result = { txHash: undefined, tx: undefined };

                        if (snap?.result) {
                            result.txHash = snap.result.txHash;

                            const tx: IBlockchainTransaction = JSON.parse(
                                await decrypt(snap.result.tx, connection.encKey)
                            );

                            result.tx = tx;
                        }

                        callback({
                            result,
                            errorCode: snap?.errorCode
                        });
                    }
                });
        } catch {
            //
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
        listenerReqResponse
    };
})();
