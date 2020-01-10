import { isWalletConnectSession } from '@walletconnect/utils';
import { IWalletConnectSession } from '@walletconnect/types';

// -- localStorage --------------------------------------------------------- //

const storageId: string = 'moonletwalletconnect';
let storage: Storage | null = null;

if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    storage = window.localStorage;
}

// -- WebStorage ----------------------------------------------------------- //

function getSession(): IWalletConnectSession | null {
    let session = null;
    let local = null;
    if (storage) {
        local = storage.getItem(storageId);
    }
    if (local && typeof local === 'string') {
        try {
            const json = JSON.parse(local);
            if (isWalletConnectSession(json)) {
                session = json;
            }
        } catch (error) {
            return null;
        }
    }
    return session;
}

function setSession(session: IWalletConnectSession): IWalletConnectSession {
    const local: string = JSON.stringify(session);
    if (storage) {
        storage.setItem(storageId, local);
    }
    return session;
}

function removeSession(): void {
    if (storage) {
        storage.removeItem(storageId);
    }
}

export const WebStorage = {
    getSession,
    setSession,
    removeSession
};
