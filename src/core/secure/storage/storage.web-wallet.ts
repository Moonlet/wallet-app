import { KEY_PREFIX } from './consts';
import * as Sentry from '@sentry/browser';

// TODO: encrypt this
export const storeEncrypted = async (data: string, key: string, hash: string): Promise<void> => {
    try {
        localStorage.setItem(`${KEY_PREFIX}${key}`, data);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

// TODO: decrypt this
export const readEncrypted = async (key: string, hash: string): Promise<string> => {
    try {
        const fullKey = `${KEY_PREFIX}${key}`;
        const encryptedData = localStorage.getItem(fullKey);
        if (encryptedData) {
            return encryptedData;
        } else {
            Promise.reject(`No data in storage for key ${KEY_PREFIX}${key}`);
        }
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const deleteFromStorage = async (key: string): Promise<void> => {
    try {
        localStorage.removeItem(`${KEY_PREFIX}${key}`);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const storeItemToStorage = async (data: string, key: string): Promise<void> => {
    try {
        localStorage.setItem(`${KEY_PREFIX}${key}`, data);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const getItemFromStorage = async (key: string): Promise<string> => {
    try {
        const fullKey = `${KEY_PREFIX}${key}`;
        const data = localStorage.getItem(fullKey);
        if (data) {
            return Promise.resolve(data);
        } else {
            Promise.reject(`No data in storage for key ${KEY_PREFIX}${key}`);
        }
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};
