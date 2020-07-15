import { Blockchain } from '../../../src/core/blockchain/types';
import klona from 'klona';
import { browser } from 'webextension-polyfill-ts';

interface IAccessAccount {
    walletPubKey: string;
    blockchain: Blockchain;
    address: string;
}

export interface IAccessSettings {
    [dappDomain: string]: IAccessAccount[];
}

const STORAGE_KEY = 'accounts_access_settings';
let accessSettings;

const loadFromStorage = async (): Promise<IAccessSettings> => {
    if (!accessSettings) {
        try {
            const data = await browser.storage.local.get(STORAGE_KEY);
            accessSettings = data[STORAGE_KEY] || {};
        } catch {
            accessSettings = {};
        }
    }

    return accessSettings;
};

const saveToStorage = async () => {
    return browser.storage.local.set({
        [STORAGE_KEY]: accessSettings
    });
};

export const getAccessSettings = async (): Promise<IAccessSettings> => {
    await loadFromStorage();
    return klona(accessSettings);
};

export const hasAccess = async (
    domain: string,
    blockchain: Blockchain,
    address: string
): Promise<boolean> => {
    await loadFromStorage();
    if (accessSettings[domain]) {
        return (
            accessSettings[domain].filter(
                account => account.blockchain === blockchain && account.address === address
            ).length > 0
        );
    }
    return Promise.resolve(false);
};

export const allowAccess = async (domain: string, accounts: IAccessAccount[]): Promise<boolean> => {
    await loadFromStorage();
    if (!accessSettings[domain]) {
        accessSettings[domain] = [];
    }

    const currentAccountsKeys = accessSettings[domain].map(
        account => `${account.walletPubKey}-${account.blockchain}-${account.address}`
    );

    for (const account of accounts) {
        if (
            currentAccountsKeys.indexOf(
                `${account.walletPubKey}-${account.blockchain}-${account.address}`
            ) < 0
        ) {
            accessSettings[domain].push(klona(account));
        }
    }

    await saveToStorage();
    return Promise.resolve(true);
};

export const declineAccess = async (
    domain: string,
    accounts?: IAccessAccount[]
): Promise<boolean> => {
    await loadFromStorage();

    if (Array.isArray(accounts)) {
        const declineAccountsKeys = accounts.map(
            account => `${account.walletPubKey}-${account.blockchain}-${account.address}`
        );

        accessSettings[domain] = accessSettings[domain].filter(
            account =>
                declineAccountsKeys.indexOf(
                    `${account.walletPubKey}-${account.blockchain}-${account.address}`
                ) < 0
        );
    } else {
        delete accessSettings[domain];
    }

    await saveToStorage();
    return Promise.resolve(true);
};

export const resetAccessSettings = async (): Promise<boolean> => {
    await loadFromStorage();
    accessSettings = {};
    await saveToStorage();
    return Promise.resolve(true);
};
