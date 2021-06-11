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
import { getTokenAvailableBalanceFormat, getTokenAvailableBalance } from './token-balance';
import { getSwapToken1AmountStd, getSwapToken2AmountStd } from './swap/amount-std';
import {
    getSwapToken1Amount,
    getSwapToken2Amount,
    getSwapToken2SwapPriceAmount
} from './swap/amount';
import {
    getSwapToken1BlockchainSymbol,
    getSwapToken2BlockchainSymbol
} from './swap/blockchain-symbol';
import { getSwapToken2Decimals } from './swap/decimals';
import { getSwapPriceRateFormat, getSwapPriceUpdateTimer } from './swap/price';
import { getSwapCustomSlippage } from './swap/slippage';
import { getSwapToken1Symbol, getSwapToken2Symbol } from './swap/symbol';
import { getSwapToken1MaxBalance, getSwapToken2MaxBalance } from './swap/max-balance';

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

    getStakeNowSelectValidators,

    getTokenAvailableBalanceFormat,
    getTokenAvailableBalance,

    // Amount std
    getSwapToken1AmountStd,
    getSwapToken2AmountStd,

    // Amount
    getSwapToken1Amount,
    getSwapToken2Amount,
    getSwapToken2SwapPriceAmount,

    // Blockchain:Symbol
    getSwapToken1BlockchainSymbol,
    getSwapToken2BlockchainSymbol,

    // Decimals
    getSwapToken2Decimals,

    // Price
    getSwapPriceRateFormat,
    getSwapPriceUpdateTimer,

    // Slippage
    getSwapCustomSlippage,

    // Symbol
    getSwapToken1Symbol,
    getSwapToken2Symbol,

    // Max balance
    getSwapToken1MaxBalance,
    getSwapToken2MaxBalance
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
