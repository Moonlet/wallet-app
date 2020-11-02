import { IReduxState } from '../../../../../redux/state';
import { IScreenModule, IScreenModuleWrapperData } from './../../../types';

import { updateClaimPending } from './update-claim-pending';

const stateModifiers = {
    updateClaimPending
};

export const getState = (state: IReduxState, module: IScreenModule) => {
    const wrapper: IScreenModuleWrapperData = module.data as IScreenModuleWrapperData;

    let wrapperState = wrapper.state;
    if (typeof stateModifiers[wrapper?.stateModifierFn] === 'function') {
        wrapperState = stateModifiers[wrapper?.stateModifierFn](state, module);
    }

    return wrapperState;
};
