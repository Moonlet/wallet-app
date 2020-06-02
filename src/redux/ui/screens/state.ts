import { IConnectHardwareWalletState } from './connectHardwareWallet/state';
import { IDashboardScreenState } from './dashboard/state';
import { IPosActionsState } from './posActions/state';

export interface IScreensState {
    connectHardwareWallet: IConnectHardwareWalletState;
    dashboard: IDashboardScreenState;
    posActions: IPosActionsState;
}
