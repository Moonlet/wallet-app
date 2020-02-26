import { IWalletsState } from './wallets/state';
import { IAppState } from './app/state';
import { IPrefState } from './preferences/state';
import { IContactsState } from './contacts/state';
import { IUiState } from './ui/state';
import { IMarketState } from './market/state';

export interface IReduxState {
    app: IAppState;
    wallets: IWalletsState;
    contacts: IContactsState;
    preferences: IPrefState;
    ui: IUiState;
    market: IMarketState;
    _persist: object;
}
