/**
 * Add Account Default Type
 */

import { IWalletState, IAccountState, AccountType } from '../../wallets/state';

export default (state: any) => {
    Object.values(state.wallets).map((wallet: IWalletState) => {
        wallet.accounts.map((account: IAccountState) => {
            account.type = AccountType.DEFAULT;
        });
    });

    return {
        ...state
    };
};
