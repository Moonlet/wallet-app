import { IScreensState } from './screens/state';
import { IBottomSheetState } from './bottomSheet/state';
import { IExtensionState } from './extension/state';

export interface IUiState {
    screens: IScreensState;
    bottomSheet: IBottomSheetState;
    extension: IExtensionState;
}
