import { IWalletState } from '../state';
import { Dispatch } from 'react';
import { IReduxState } from '../../state';
import { storeEncrypted, readEncrypted } from '../../../core/secure/storage/storage';

import { getEncryptionKey, generateEncryptionKey } from '../../../core/secure/keychain/keychain';

export const changePIN = (newPassword: string, oldPassword: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    const encryptionKey = await getEncryptionKey(oldPassword);
    const newEncryptionKey = await generateEncryptionKey(newPassword);

    Object.values(state.wallets).map(async (wallet: IWalletState) => {
        const walletId = wallet.id;

        const mnemonic = await readEncrypted(walletId, encryptionKey);

        await storeEncrypted(mnemonic, walletId, newEncryptionKey);
    });
};
