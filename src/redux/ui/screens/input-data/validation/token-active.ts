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

    const symbol = validation?.params && validation.params[0]?.symbol;

    const tokens = account.tokens[chainId];

    if (symbol && tokens) {
        if (!tokens[symbol]) {
            // TODO
        }

        if (tokens[symbol]) {
            const tokenConfig = tokens[symbol];
            if (!tokenConfig.active) {
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
        }
    }
};
