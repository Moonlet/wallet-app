import { Blockchain } from '../../../../core/blockchain/types';
import { ITokenState } from '../../../wallets/state';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { Dispatch } from 'react';
import { NavigationService } from '../../../../navigation/navigation-service';

// actions consts
export const QUICK_DELEGATE_ENTER_AMOUNT = 'QUICK_DELEGATE_ENTER_AMOUNT';
export const DELEGATE_ENTER_AMOUNT = 'DELEGATE_ENTER_AMOUNT';

export const navigateToNextStep = (
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
