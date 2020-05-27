import { IQRCodeConn } from './types';
import { IBlockchainTransaction } from '../blockchain/types';

export const ConnectExtensionWeb = (() => {
    const storeConnection = async (conn: IQRCodeConn): Promise<void> => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const disconnect = async (): Promise<void> => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const getConnection = async (): Promise<IQRCodeConn> => {
        throw new Error('NOT_IMPLEMENTED');
    };

    // TODO: maybe find a better way to check this
    // it would help if it's not a promise because Dashboard is loading
    const isConnected = async (): Promise<boolean> => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const generateQRCodeUri = async (): Promise<{ uri: string; conn: IQRCodeConn }> => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const downloadFileStorage = async (connectionId: string): Promise<string> => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const listenLastSync = async () => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const listenLastSyncForConnect = (conn: IQRCodeConn) => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const getRequestIdParams = async (requestId: string): Promise<any> => {
        throw new Error('NOT_IMPLEMENTED');
    };

    const listenerReqResponse = async (
        requestId: string,
        callback: (res: {
            result: { txHash: string; tx: IBlockchainTransaction };
            errorCode: string;
        }) => void
    ) => {
        throw new Error('NOT_IMPLEMENTED');
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
