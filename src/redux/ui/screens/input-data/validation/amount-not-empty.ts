import { Dispatch } from 'react';
import { IScreenFieldValidation } from '../../../../../components/widgets/types';
import { IReduxState } from '../../../../state';
import { IAction } from '../../../../types';
import { setScreenInputValidation } from '../actions';

export const inputAmountNotEmpty = (
    validation: IScreenFieldValidation,
    field: string,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    const state = getState();

    const inputData: any = state.ui.screens.inputData[screenKey]?.data;

    const amount = inputData?.amount || inputData?.input;

    if (!amount || isNaN(amount) || amount === '' || amount === ' ') {
        // Show error

        const fieldsErrors = [];

        for (const msgKey of Object.keys(validation?.messages || [])) {
            fieldsErrors.push(validation.messages[msgKey]);
        }

        setScreenInputValidation(screenKey, {
            fieldsErrors: {
                [field]: fieldsErrors
            },
            valid: false
        })(dispatch, getState);
    }
};
