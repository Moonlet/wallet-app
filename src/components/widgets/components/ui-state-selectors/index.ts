import { IReduxState } from '../../../../redux/state';
import { IScreenModule } from './../../types';

import { getSwitchNodeSelectedValidatorName } from './switch-node-selected-validator';
import { getStakeEnterAllBalance } from './stake-enter-all-balance';
import { getSwitchNodeEnterAvailableBalance } from './switch-node-enter-available-balance';

const uiStateSelectors = {
    getStakeEnterAllBalance,
    getSwitchNodeEnterAvailableBalance,
    getSwitchNodeSelectedValidatorName
};

export const getStateSelectors = (state: IReduxState, module: IScreenModule, options?: any) => {
    const uiState = {};

    if (module?.state?.selectors) {
        for (const selector of Object.keys(module.state.selectors)) {
            if (typeof uiStateSelectors[module.state.selectors[selector].fn] === 'function') {
                uiState[selector] = uiStateSelectors[module.state.selectors[selector].fn](
                    state,
                    module,
                    options
                );
            }
        }
    }

    return uiState;
};
