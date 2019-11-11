import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { Blockchain } from '../../core/blockchain/types';
import { WalletType } from '../../core/wallet/types';
import { IWalletState } from './state';
import { IAction } from '../types';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { appSwitchWallet } from '../app/actions';
import uuidv4 from 'uuid/v4';
import { getPassword } from '../../core/secure/keychain';
import { storeEncrypted } from '../../core/secure/storage';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

// actions consts
export const WALLET_ADD = 'WALLET_ADD';
export const ACCOUNT_CREATE = 'ACCOUNT_CREATE';
export const ACCOUNT_GET_BALANCE = 'ACCOUNT_GET_BALANCE';

// action creators
export const addWallet = (walletData: IWalletState) => {
    return {
        type: WALLET_ADD,
        data: walletData
    };
};

export const createHDWallet = (mnemonic: string, callback?: () => any) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    try {
        const wallet = new HDWallet(mnemonic);

        // generate initial accounts for each blockchain
        Promise.all([
            wallet.getAccounts(Blockchain.ETHEREUM, 0),
            wallet.getAccounts(Blockchain.ZILLIQA, 0)
        ]).then(async data => {
            const walletId = uuidv4();

            dispatch(
                addWallet({
                    id: walletId,
                    type: WalletType.HD,
                    accounts: data[0].concat(data[1])
                })
            );

            const passwordCredentials = await getPassword();
            let passwordHash = '';

            if (passwordCredentials) {
                passwordHash = passwordCredentials.password;
            } else {
                // password not in keychain? request pass
            }

            await storeEncrypted(mnemonic, walletId, passwordHash);

            dispatch(appSwitchWallet(getState().wallets.length - 1));
            callback && callback();
        });
    } catch (e) {
        // console.log(e);
    }
};

export const getBalance = (
    blockchain: Blockchain,
    chainId: number,
    address: string,
    force: boolean = false
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const wallet = state.wallets[state.app.currentWalletIndex];
    const account = wallet.accounts.filter(
        acc => acc.address === address && acc.blockchain === blockchain
    )[0];
    const balanceInProgress = account?.balance?.inProgress;
    const balanceTimestamp = account?.balance?.timestamp || 0;

    if (force || (!balanceInProgress && balanceTimestamp + 10 * 3600 < Date.now())) {
        dispatch({
            type: ACCOUNT_GET_BALANCE,
            inProgress: true
        });
        try {
            const balance = await getBlockchain(blockchain)
                .getClient(chainId)
                .getBalance(address);
            dispatch({
                type: ACCOUNT_GET_BALANCE,
                data: balance
            });
        } catch (error) {
            dispatch({
                type: ACCOUNT_GET_BALANCE,
                error
            });
        }
    }
};
