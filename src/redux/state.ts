import { IWalletState } from './wallets/state';
import { IAppState } from './app/state';
import { IPrefState } from './preferences/state';
import { IContactsState } from './contacts/state';
import { ILedgerState } from './screens/ledger/state';

export interface IReduxState {
    app: IAppState;
    wallets: IWalletState[];
    contacts: IContactsState;
    preferences: IPrefState;
    ledger: ILedgerState;
    _persist: object;
}
