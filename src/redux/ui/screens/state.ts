import { IConnectHardwareWalletState } from './connectHardwareWallet/state';
import { IPosActionsState } from './posActions/state';

export interface IScreensState {
    connectHardwareWallet: IConnectHardwareWalletState;
    posActions: IPosActionsState;
}
