import { IReduxState } from '../../../../../redux/state';
import { IScreenModule } from '../../../types';

export const switchNodeSelectValidator = (state: IReduxState, module: IScreenModule): string => {
    const flowId = module?.details?.flowId;

    if (
        flowId &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[flowId]?.data?.switchNodeValidator?.id ===
            module?.details?.validator?.id
    ) {
        return 'SELECTED';
    }

    return 'DEFAULT';
};
