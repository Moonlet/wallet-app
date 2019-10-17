import { IWalletState } from './wallets/state';
import { IAppState } from './app/state';

export interface IReduxState {
    app: IAppStates;
    wallets: IWalletState[];
}
