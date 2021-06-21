import { IAppState } from './app/state';
import { IContactsState } from './contacts/state';
import { IMarketState } from './market/state';
import { INotificationsState } from './notifications/state';
import { IPrefState } from './preferences/state';
import { ITokensConfigState } from './tokens/state';
import { IUiState } from './ui/state';
import { IValidatorsState } from './ui/validators/state';
import { IWalletsState } from './wallets/state';

export interface IReduxState {
    app: IAppState;
    contacts: IContactsState;
    market: IMarketState;
    notifications: INotificationsState;
    preferences: IPrefState;
    tokens: ITokensConfigState;
    ui: IUiState;
    validators: IValidatorsState;
    wallets: IWalletsState;
    _persist: object;
}
