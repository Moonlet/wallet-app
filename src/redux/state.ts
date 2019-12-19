import { IWalletsState } from './wallets/state';
import { IAppState } from './app/state';
import { IPrefState } from './preferences/state';
import { IContactsState } from './contacts/state';
import { IScreensState } from './screens/state';

export interface IReduxState {
    app: IAppState;
    wallets: IWalletsState;
    contacts: IContactsState;
    preferences: IPrefState;
    screens: IScreensState;
    _persist: object;
}
