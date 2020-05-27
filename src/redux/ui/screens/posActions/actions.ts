import { Blockchain, IFeeOptions } from '../../../../core/blockchain/types';
import { ITokenState } from '../../../wallets/state';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { Dispatch } from 'react';
import { NavigationService } from '../../../../navigation/navigation-service';

// actions consts
export const QUICK_DELEGATE_ENTER_AMOUNT = 'QUICK_DELEGATE_ENTER_AMOUNT';
export const DELEGATE_ENTER_AMOUNT = 'DELEGATE_ENTER_AMOUNT';
export const REDELEGATE_ENTER_AMOUNT = 'REDELEGATE_ENTER_AMOUNT';

export const QUICK_DELEGATE_CONFIRMATION = 'QUICK_DELEGATE_CONFIRMATION';
export const DELEGATE_CONFIRMATION = 'DELEGATE_CONFIRMATION';
export const REDELEGATE_CONFIRMATION = 'REDELEGATE_CONFIRMATION';

export const navigateToEnterAmountStep = (
    accountIndex: number,
    blockchain: Blockchain,
    token: ITokenState,
    validators: IValidator[],
    actionText: string,
    screen: string,
    actionType: string
) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: actionType,
        data: {
            accountIndex,
            blockchain,
            token,
            validators,
            actionText
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
    feeOptions: IFeeOptions
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
            feeOptions
        }
    });
    NavigationService.navigate(screen, {});
};
