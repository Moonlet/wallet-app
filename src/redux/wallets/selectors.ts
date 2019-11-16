import { IReduxState } from '../state';
import { IWalletState } from './state';

export const selectCurrentWallet = (state: IReduxState): IWalletState =>
    state.wallets.find(wallet => wallet.id === state.app.currentWalletId);
