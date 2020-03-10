import { IConnectHardwareWalletState } from './connectHardwareWallet/state';
import { IDashboardScreenState } from './dashboard/state';

export interface IScreensState {
    connectHardwareWallet: IConnectHardwareWalletState;
    dashboard: IDashboardScreenState;
}
