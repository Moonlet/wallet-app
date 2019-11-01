import { IWalletState } from './wallets/state';
import { IAppState } from './app/state';
import { IPrefState } from './preferences/state';

export interface IReduxState {
    app: IAppState;
    wallets: IWalletState[];
    preferences: IPrefState;
    _persist: object;
}
