import { IScreensState } from './screens/state';
import { IBottomSheetState } from './bottomSheet/state';
import { IExtensionState } from './extension/state';
import { IPasswordModalState } from './password-modal/state';
import { ITransactionRequestState } from './transaction-request/state';
import { IValidatorsState } from './validators/state';

export interface IUiState {
    screens: IScreensState;
    bottomSheet: IBottomSheetState;
    extension: IExtensionState;
    passwordModal: IPasswordModalState;
    transactionRequest: ITransactionRequestState;
    validators: IValidatorsState;
}
