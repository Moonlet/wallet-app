import { amountAvailableFunds } from './amount-available-funds';
import { amountAvailableFundsToKeep } from './amount-available-funds-to-keep';
import { minAmountToStake } from './min-amount-to-stake';
import { switchNodeMinAmountDelegate } from './switch-node-min-amount-delegate';
import { switchNodeValidateAmount } from './switch-node-validate-amount';
import { switchNodeAvailableFunds } from './switch-node-available-funds';
import { inputAmountNotEmpty } from './amount-not-empty';

export const screenInputValidationActions = {
    amountAvailableFunds,
    amountAvailableFundsToKeep,
    minAmountToStake,
    switchNodeMinAmountDelegate,
    switchNodeValidateAmount,
    switchNodeAvailableFunds,
    inputAmountNotEmpty
};
