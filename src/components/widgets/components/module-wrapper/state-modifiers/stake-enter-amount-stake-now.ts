import { IReduxState } from '../../../../../redux/state';
import { IScreenModule, IScreenModuleWrapperData } from '../../../types';

export const stakeEnterAmountStakeNow = (state: IReduxState, module: IScreenModule): string => {
    const wrapper = module.data as IScreenModuleWrapperData;

    const flowId = wrapper?.data?.DEFAULT?.details?.flowId;

    if (
        flowId &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[flowId] &&
        state.ui.screens.inputData[flowId]?.validation &&
        state.ui.screens.inputData[flowId]?.validation?.valid === false
    ) {
        return 'DISABLED';
    }

    return 'DEFAULT';
};
