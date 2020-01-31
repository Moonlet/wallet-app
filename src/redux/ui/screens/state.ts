import { IConnectHardwareWalletState } from './connectHardwareWallet/state';
import { ISendScreenState } from './send/state';
import { IDashboardScreenState } from './dashboard/state';

export interface IScreensState {
    connectHardwareWallet: IConnectHardwareWalletState;
    send: ISendScreenState;
    dashboard: IDashboardScreenState;
}
