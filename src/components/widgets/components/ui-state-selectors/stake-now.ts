import { translate } from '../../../../core/i18n';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../redux/state';
import { getScreenDataKey } from '../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../redux/wallets/selectors';
import { IScreenModule } from './../../types';

export const getStakeNowSelectValidators = (state: IReduxState, module: IScreenModule) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: module?.details?.step,
        tab: undefined
    });

    const validators: any = state.ui.screens.inputData[screenKey]?.data?.validators;

    if (validators && Array.isArray(validators) && validators.length > 0) {
        if (validators.length === 1) {
            return validators[0].name;
        }

        if (validators.length > 1) {
            return `${validators.length} ${translate('App.labels.validators')}`;
        }
    }

    return '___...___';
};
