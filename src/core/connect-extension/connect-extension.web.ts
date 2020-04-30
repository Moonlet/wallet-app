import { generateRandomEncryptionKey } from '../secure/encrypt.web';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { IQRCode } from './types';
import { storage } from 'firebase';

const BUCKET = 'gs://moonlet-extension-sync';

export class ConnectExtensionWeb {
    public connect() {
        //
    }

    public disconnect() {
        //
    }

    public isConnected() {
        return false;
    }

    public getState() {
        //
    }

    public async generateQRCodeUri(): Promise<{ uri: string; conn: IQRCode }> {
        const conn: IQRCode = {
            connectionId: uuidv4(),
            encKey: generateRandomEncryptionKey().toString(CryptoJS.enc.Base64),
            os: 'Windows%2010',
            platform: 'Chrome'
        };

        // console.log(window.navigator.platform);

        const uri = `mooonletExtSync:${conn.connectionId}@firebase/?encKey=${conn.encKey}&os=${conn.os}&browser=${conn.platform}`;

        return { uri, conn };
    }

    public async downloadFileStorage(connectionId: string): Promise<string> {
        try {
            // Download file from Firebase Storage - State
            const urlDowndload = await storage()
                .refFromURL(BUCKET)
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
}
