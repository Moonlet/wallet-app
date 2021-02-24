import { IReduxState } from '../../../../redux/state';
import { IScreenModule } from './../../types';

import {
    getSwitchNodeSelectedValidatorName,
    getSwitchNodeSelectedToValidatorName
} from './switch-node-selected-validator';
import {
    getStakeEnterAllBalance,
    getStakeEnterAllBalanceFormat,
    getAvailableBalanceParams,
    getAvailableBalanceFormatParams
} from './stake-enter-all-balance';
import {
    getSwitchNodeEnterAvailableBalance,
    getSwitchNodeEnterAvailableBalanceFormat
} from './switch-node-enter-available-balance';
import {
    getInputBalanceFormat,
    getStakeAmountPerValidator,
    getInputBalanceConverted,
    getStakeAmountValidatorSplit
} from './input-balance-format';
import { getStakeNowSelectValidators } from './stake-now';

const uiStateSelectors = {
    getStakeEnterAllBalance,
    getStakeEnterAllBalanceFormat,
    getAvailableBalanceParams,
    getAvailableBalanceFormatParams,

    getSwitchNodeEnterAvailableBalance,
    getSwitchNodeEnterAvailableBalanceFormat,

    getSwitchNodeSelectedValidatorName,
    getSwitchNodeSelectedToValidatorName,

    getInputBalanceFormat,
    getInputBalanceConverted,
    getStakeAmountValidatorSplit,

    getStakeAmountPerValidator,

    getStakeNowSelectValidators
};

export const getStateSelectors = (state: IReduxState, module: IScreenModule, options?: any) => {
    const uiState = {};

    if (module?.state?.selectors) {
        for (const selector of Object.keys(module.state.selectors)) {
            if (typeof uiStateSelectors[module.state.selectors[selector].fn] === 'function') {
                uiState[selector] = uiStateSelectors[module.state.selectors[selector].fn](
                    state,
                    module,
                    options,
                    module.state.selectors[selector]?.params
                );
            }
        }
    }

    return uiState;
};
