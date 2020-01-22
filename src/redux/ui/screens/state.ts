import { IConnectHardwareWalletState } from './connectHardwareWallet/state';
import { ISendScreenState } from './send/state';

export interface IScreensState {
    connectHardwareWallet: IConnectHardwareWalletState;
    send: ISendScreenState;
}
