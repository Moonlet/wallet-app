import { Dispatch } from 'react';
import { Dialog } from '../../../../../components/dialog/dialog';
import { IScreenFieldValidation } from '../../../../../components/widgets/types';
import { translate } from '../../../../../core/i18n';
import { NavigationService } from '../../../../../navigation/navigation-service';
import { getChainId } from '../../../../preferences/selectors';
import { IReduxState } from '../../../../state';
import { IAction } from '../../../../types';
import { getSelectedAccount } from '../../../../wallets/selectors';
import { setScreenInputValidation } from '../actions';

export const tokenActiveWallet = (
    validation: IScreenFieldValidation,
    field: string,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    const state = getState();

    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    let symbol = validation?.params && validation.params[0]?.symbol;

    if (!symbol) {
        const screenInputData =
            screenKey && state.ui.screens.inputData && state.ui.screens.inputData[screenKey];

        symbol = screenInputData?.data && screenInputData?.data[field]?.symbol;
    }

    const tokens = account.tokens[chainId];

    let showError = false;

    if (symbol && tokens) {
        if (!tokens[symbol]) {
            showError = true;
        }

        if (tokens[symbol]) {
            const tokenConfig = tokens[symbol];
            if (!tokenConfig.active) {
                showError = true;
            }
        }
    }

    if (showError) {
        Dialog.alert(
            'Inactive token',
            `Please activate ${symbol} token`,
            {
                text: translate('App.labels.cancel'),
                onPress: () => {
                    //
                }
            },
            {
                text: 'Activate',
                onPress: () => NavigationService.navigate('AddToken', {})
            }
        );

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
