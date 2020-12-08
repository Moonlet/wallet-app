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

export const switchNodeSelectNodeBottomWrapper = (
    state: IReduxState,
    module: IScreenModule
): string => {
    const flowId = module?.details?.flowId;

    if (
        flowId &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[flowId]?.data?.switchNodeValidator?.id !== undefined
    ) {
        return 'SELECTED';
    }

    return 'DEFAULT';
};

export const switchNodeSelectReasons = (state: IReduxState, module: IScreenModule): string => {
    const flowId = module?.details?.flowId;
    const infoText = module?.details?.infoText;

    if (
        flowId &&
        state.ui.screens.inputData &&
        (state.ui.screens.inputData[flowId]?.data?.selectReasons || []).findIndex(
            reason => reason === infoText
        ) !== -1
    ) {
        return 'SELECTED';
    }

    return 'DEFAULT';
};

export const switchNodeContinueInfo1 = (state: IReduxState, module: IScreenModule): string => {
    const flowId = module?.details?.flowId;

    if (
        flowId &&
        state.ui.screens.inputData &&
        (state.ui.screens.inputData[flowId]?.data?.selectReasons || []).length >= 1
    ) {
        return 'SELECTED';
    }

    return 'DEFAULT';
};

export const switchNodeContinueInfo2 = (state: IReduxState, module: IScreenModule): string => {
    const flowId = module?.details?.flowId;

    if (
        flowId &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[flowId]?.data?.input?.length >= 1
    ) {
        return 'SELECTED';
    }

    return 'DEFAULT';
};
