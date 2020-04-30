import { browser } from 'webextension-polyfill-ts';
// import { encrypt, decrypt } from './encrypt.web';

const KEY_PREFIX = 'mw-';

export const storeEncrypted = async (data: string, key: string, hash: string) => {
    // const encryptedData = encrypt(data, hash);
    try {
        await browser.storage.local.set({ [`${KEY_PREFIX}${key}`]: data });
    } catch (e) {
        return Promise.reject(e);
    }
};

export const readEncrypted = async (key: string, hash: string) => {
    try {
        const fullKey = `${KEY_PREFIX}${key}`;
        const encryptedData = await browser.storage.local.get(fullKey);
        if (encryptedData && encryptedData[fullKey]) {
            // console.log('encryptedData.fullKey: ', encryptedData.fullKey);
            // const data = decrypt(encryptedData.fullKey, hash);
            return encryptedData[fullKey];
        }
        return Promise.reject(`No data in storage for key ${KEY_PREFIX}${key}`);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const deleteFromStorage = async (key: string) => {
    try {
        await browser.storage.local.remove(`${KEY_PREFIX}${key}`);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const getItemFromStorage = async (key: string) => {
    try {
        return Promise.resolve(await browser.storage.local.get(`${KEY_PREFIX}${key}`));
    } catch (e) {
        return Promise.reject(e);
    }
};
