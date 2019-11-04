import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { Blockchain } from '../../core/blockchain/types';
import { WalletType } from '../../core/wallet/types';
import { IWalletState } from './state';
import { IAction } from '../types';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { appSwitchWallet } from '../app/actions';

// actions consts
export const WALLET_ADD = 'WALLET_ADD';
export const ACCOUNT_CREATE = 'ACCOUNT_CREATE';

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
        ]).then(data => {
            dispatch(
                addWallet({
                    id: 'hdWallet',
                    type: WalletType.HD,
                    accounts: data[0].concat(data[1])
                })
            );

            dispatch(appSwitchWallet(getState().wallets.length - 1));
            callback && callback();
        });
    } catch (e) {
        // console.log(e);
    }
};
