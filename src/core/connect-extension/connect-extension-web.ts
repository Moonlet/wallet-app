import { IQRCodeConn } from './types';

export const ConnectExtensionWeb = (() => {
    const storeConnection = async (conn: IQRCodeConn) => {
        //
    };

    const disconnect = async () => {
        //
    };

    const getConnection = async () => {
        //
    };

    const isConnected = async () => {
        return false;
    };

    // const getState = () => {
    //     //
    // };

    const storeState = (decryptedState: any) => {
        //
    };

    // const setStore = (storeReference: any) => {
    //     //
    // };

    const generateQRCodeUri = async () => {
        //
    };

    const downloadFileStorage = async (connectionId: string) => {
        //
    };

    const listenLastSync = async (conn: IQRCodeConn) => {
        //
    };

    const test = async (conn: any) => {
        //
    };

    return {
        storeConnection,
        disconnect,
        getConnection,
        isConnected,
        // getState,
        storeState,
        // setStore,
        generateQRCodeUri,
        downloadFileStorage,
        listenLastSync,
        test
    };
})();
