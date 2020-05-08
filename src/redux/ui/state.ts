import { IScreensState } from './screens/state';
import { IBottomSheetState } from './bottomSheet/state';
import { IExtensionState } from './extension/state';
import { ILoadingModalState } from './loading-modal/state';
import { IPasswordModalState } from './password-modal/state';
import { ITransactionRequestState } from './transaction-request/state';

export interface IUiState {
    screens: IScreensState;
    bottomSheet: IBottomSheetState;
    extension: IExtensionState;
    loadingModal: ILoadingModalState;
    passwordModal: IPasswordModalState;
    transactionRequest: ITransactionRequestState;
}
