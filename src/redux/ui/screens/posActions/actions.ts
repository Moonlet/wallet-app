import { Blockchain, IFeeOptions } from '../../../../core/blockchain/types';
import { ITokenState } from '../../../wallets/state';
import { Dispatch } from 'react';
import { NavigationService } from '../../../../navigation/navigation-service';
import { IValidator } from '../../stats/state';

// actions consts
export const QUICK_DELEGATE_ENTER_AMOUNT = 'QUICK_DELEGATE_ENTER_AMOUNT';
export const DELEGATE_ENTER_AMOUNT = 'DELEGATE_ENTER_AMOUNT';
export const REDELEGATE_ENTER_AMOUNT = 'REDELEGATE_ENTER_AMOUNT';

export const DELEGATE_CONFIRMATION = 'DELEGATE_CONFIRMATION';
export const REDELEGATE_CONFIRMATION = 'REDELEGATE_CONFIRMATION';

export const navigateToEnterAmountStep = (
    accountIndex: number,
    blockchain: Blockchain,
    token: ITokenState,
    validators: IValidator[],
    actionText: string,
    screen: string,
    actionType: string,
    fromValidator?: IValidator
) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: actionType,
        data: {
            accountIndex,
            blockchain,
            token,
            validators,
            actionText,
            fromValidator
        }
    });

    NavigationService.navigate(screen, {});
};

export const navigateToConfirmationStep = (
    accountIndex: number,
    blockchain: Blockchain,
    token: ITokenState,
    validators: IValidator[],
    actionText: string,
    screen: string,
    actionType: string,
    amount: string,
    feeOptions: IFeeOptions,
    fromValidator?: IValidator
) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: actionType,
        data: {
            accountIndex,
            blockchain,
            token,
            validators,
            actionText,
            amount,
            feeOptions,
            fromValidator
        }
    });
    NavigationService.navigate(screen, {});
};
