import { IReduxState } from '../../../../../redux/state';
import {
    IScreenModule,
    IScreenModuleSelectableWrapperData,
    IScreenModuleWrapperData,
    ModuleTypes
} from './../../../types';

import { updateClaimPending } from './update-claim-pending';
import { quickStakeSelectedValidator } from './quick-stake-selected-validator';
import { stakeEnterAmountStakeNow } from './stake-enter-amount-stake-now';
import { switchNodeSelectValidator } from './switch-node-select-validator';

const stateModifiers = {
    updateClaimPending,
    quickStakeSelectedValidator,
    stakeEnterAmountStakeNow,
    switchNodeSelectValidator
};

export const getState = (state: IReduxState, module: IScreenModule) => {
    let wrapper;

    switch (module.type) {
        case ModuleTypes.MODULE_WRAPPER:
            wrapper = module.data as IScreenModuleWrapperData;
            break;

        case ModuleTypes.MODULE_SELECTABLE_WRAPPER:
            wrapper = module.data as IScreenModuleSelectableWrapperData;
            break;

        default:
            break;
    }

    let wrapperState = wrapper.state;
    if (typeof stateModifiers[wrapper?.stateModifierFn] === 'function') {
        wrapperState = stateModifiers[wrapper?.stateModifierFn](state, module);
    }

    return wrapperState;
};
