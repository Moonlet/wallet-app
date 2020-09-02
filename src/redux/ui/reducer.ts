import { combineReducers } from 'redux';
import { screensReducer } from './screens/reducer';
import extensionReducer from './extension/reducer';
import bottomSheetReducer from './bottomSheet/reducer';
import passwordModalReducer from './password-modal/reducer';
import transactionRequestReducer from './transaction-request/reducer';
import validatorsReducer from './validators/reducer';
import delegatedValidatorsReducer from './delegated-validators/reducer';
import processTransactionsReducer from './process-transactions/reducer';

export const uiReducer = combineReducers({
    screens: screensReducer,
    extension: extensionReducer,
    bottomSheet: bottomSheetReducer,
    passwordModal: passwordModalReducer,
    transactionRequest: transactionRequestReducer,
    processTransactions: processTransactionsReducer,
    validators: validatorsReducer,
    delegatedValidators: delegatedValidatorsReducer
});
