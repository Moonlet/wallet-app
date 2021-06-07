import { amountAvailableFunds, amountAvailableFundsToken } from './amount-available-funds';
import { amountAvailableFundsToKeep } from './amount-available-funds-to-keep';
import { minAmountToStake, minAmountToStakePerValidator } from './min-amount-to-stake';
import { switchNodeMinAmountDelegate } from './switch-node-min-amount-delegate';
import { switchNodeValidateAmount } from './switch-node-validate-amount';
import { switchNodeAvailableFunds } from './switch-node-available-funds';
import { inputAmountNotEmpty } from './amount-not-empty';
import { tokenActiveWallet } from './token-active';

export const screenInputValidationActions = {
    amountAvailableFunds,
    amountAvailableFundsToken,
    amountAvailableFundsToKeep,
    minAmountToStake,
    minAmountToStakePerValidator,
    switchNodeMinAmountDelegate,
    switchNodeValidateAmount,
    switchNodeAvailableFunds,
    inputAmountNotEmpty,
    tokenActiveWallet
};
