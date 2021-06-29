import { IScreensState } from './screens/state';
import { IBottomSheetState } from './bottomSheet/state';
import { IExtensionState } from './extension/state';
import { IPasswordModalState } from './password-modal/state';
import { ITransactionRequestState } from './transaction-request/state';
import { IValidatorsState } from './validators/state';
import { IProcessTransactionsState } from './process-transactions/state';
import { IStatsState } from './stats/state';
import { IDelegatedValidatorsState } from './delegated-validators/state';

export interface IUiState {
    screens: IScreensState;
    bottomSheet: IBottomSheetState;
    extension: IExtensionState;
    passwordModal: IPasswordModalState;
    transactionRequest: ITransactionRequestState;
    processTransactions: IProcessTransactionsState;
    validators: IValidatorsState;
    delegatedValidators: IDelegatedValidatorsState;
    stats: IStatsState;
}
