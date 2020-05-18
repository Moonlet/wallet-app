import { browser } from 'webextension-polyfill-ts';
import { KEY_PREFIX } from './consts';
import * as Sentry from '@sentry/react-native';

// TODO: encrypt this
export const storeEncrypted = async (data: string, key: string, hash: string): Promise<void> => {
    try {
        await browser.storage.local.set({ [`${KEY_PREFIX}${key}`]: data });
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

// TODO: decrypt this
export const readEncrypted = async (key: string, hash: string): Promise<string> => {
    try {
        const fullKey = `${KEY_PREFIX}${key}`;
        const encryptedData = await browser.storage.local.get(fullKey);
        if (encryptedData && encryptedData[fullKey]) {
            return encryptedData[fullKey];
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
        await browser.storage.local.remove(`${KEY_PREFIX}${key}`);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const storeItemToStorage = async (data: string, key: string): Promise<void> => {
    try {
        await browser.storage.local.set({ [`${KEY_PREFIX}${key}`]: data });
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const getItemFromStorage = async (key: string): Promise<string> => {
    try {
        const fullKey = `${KEY_PREFIX}${key}`;
        const data = await browser.storage.local.get(fullKey);
        if (data && data[fullKey]) {
            return Promise.resolve(data[fullKey]);
        } else {
            Promise.reject(`No data in storage for key ${KEY_PREFIX}${key}`);
        }
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};
