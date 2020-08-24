import { Blockchain } from '../../../src/core/blockchain/types';
import klona from 'klona';
import { browser } from 'webextension-polyfill-ts';
import { store } from '../../../src/redux/config';
import { getWalletWithAddress } from '../../../src/redux/wallets/selectors';

export interface IAccessAccount {
    walletPubKey: string;
    blockchain: Blockchain;
    address: string;
}

export interface IAccessSettings {
    [dappDomain: string]: IAccessAccount[];
}

const STORAGE_KEY = 'accounts_access_settings';
let accessSettings: IAccessSettings;
const accountsMap: { [blockchain: string]: { [walletPubKey: string]: string[] } } = {};

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

export const getAccountInfo = async (
    domain: string,
    blockchain: Blockchain,
    address: string
): Promise<IAccessAccount> => {
    await loadFromStorage();
    if (accessSettings[domain]) {
        return accessSettings[domain].find(
            account => account.blockchain === blockchain && account.address === address
        );
    }
    return Promise.resolve(undefined);
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

export const getDomainAccounts = async (
    domain: string,
    blockchain: Blockchain
): Promise<IAccessAccount[]> => {
    await loadFromStorage();
    if (!accountsMap[blockchain]) {
        accountsMap[blockchain] = {};
    }

    if (Array.isArray(accessSettings[domain]) && accessSettings[domain].length > 0) {
        const domainAccounts = (accessSettings[domain] || []).filter(
            s => s.blockchain === blockchain
        );
        const walletPubKey = domainAccounts[0]?.walletPubKey;

        // getting list of accounts stored locally (based on switch history)
        let accounts = accountsMap[blockchain][walletPubKey] || [];
        // add the list of all accounts from the same wallet, to be sure we have all accounts
        const wallet =
            getWalletWithAddress(
                store.getState(),
                domainAccounts.map(s => s.address),
                blockchain
            )[0] || null;

        if (wallet) {
            accounts.push(
                wallet.accounts.find(acc => acc.selected && acc.blockchain === blockchain).address
            );
            accounts.push(
                ...wallet?.accounts
                    .filter(acc => acc.blockchain === blockchain)
                    .map(acc => acc.address)
            );

            // remove duplicates
            accounts = [...new Set(accounts)];

            return accounts
                .filter(addr => domainAccounts.map(s => s.address).indexOf(addr) >= 0)
                .map(address => ({
                    walletPubKey,
                    address,
                    blockchain
                }));
        }
    }
    return [];
};

export const switchAccount = async (
    walletPubKey: string,
    blockchain: Blockchain,
    address: string
) => {
    await loadFromStorage();
    if (!accountsMap[blockchain]) {
        accountsMap[blockchain] = {};
    }
    // console.log(walletPubKey, blockchain, address);
    const accounts = accountsMap[blockchain][walletPubKey] || [];
    // add the list of all accounts from the same wallet, to be sure we have all accounts
    accounts.unshift(address);
    // remove duplicates
    accountsMap[blockchain][walletPubKey] = [...new Set(accounts)];
    // console.log(accountsMap);
    return Promise.resolve();
};
