/**
 * Solana change `Account 0` to `Root Account` - 25 Mar 2021
 */

import { Blockchain } from '../../../core/blockchain/types';
import { translate } from '../../../core/i18n';
import { AccountType, IWalletState } from '../../wallets/state';

export default (state: any) => {
    for (const walletKey of Object.keys(state.wallets)) {
        const wallet: IWalletState = state.wallets[walletKey];
        for (const [accIndex, account] of wallet.accounts.entries()) {
            if (
                account.blockchain === Blockchain.SOLANA &&
                account.index === -1 &&
                account.type === AccountType.ROOT
            ) {
                state.wallets[walletKey].accounts[accIndex].name = translate(
                    'App.labels.rootAccount'
                );
            }
        }
    }

    return {
        ...state
    };
};
