import { IWalletState } from './wallets/state';
import { IAppState } from './app/state';

export interface IReduxState {
    app: IAppState;
    wallets: IWalletState[];
}
