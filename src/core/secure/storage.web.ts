// import { browser } from 'webextension-polyfill-ts';

export const storeEncrypted = async (data: string, key: string, hash: string) => {
    // browser.storage.local.set
    return Promise.resolve('NOT_IMPLEMENTED');
};

export const readEncrypted = async (key: string, hash: string) => {
    return Promise.resolve('NOT_IMPLEMENTED');
};

export const deleteFromStorage = async (key: string) => {
    return Promise.resolve('NOT_IMPLEMENTED');
};

export const getItemFromStorage = async (key: string) => {
    return Promise.resolve('NOT_IMPLEMENTED');
};
