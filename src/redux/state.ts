import { IWalletsState } from './wallets/state';
import { IAppState } from './app/state';
import { IPrefState } from './preferences/state';
import { IContactsState } from './contacts/state';
import { IUiState } from './ui/state';
import { IMarketState } from './market/state';
import { ITokensConfigState } from './tokens/state';
import { INotificationsState } from './notifications/state';

export interface IReduxState {
    app: IAppState;
    wallets: IWalletsState;
    contacts: IContactsState;
    preferences: IPrefState;
    ui: IUiState;
    market: IMarketState;
    tokens: ITokensConfigState;
    notifications: INotificationsState;
    _persist: object;
}
