import { IReduxState } from '../../../../../redux/state';
import { IScreenModule } from '../../../types';

export const swapToggleAction = (state: IReduxState, module: IScreenModule): string => {
    // const flowId = module?.details?.flowId;
    // const infoText = module?.details?.infoText;

    // if (
    //     flowId &&
    //     state.ui.screens.inputData &&
    //     (state.ui.screens.inputData[flowId]?.data?.selectReasons || []).findIndex(
    //         reason => reason === infoText
    //     ) !== -1
    // ) {
    //     return 'SELECTED';
    // }

    // 'BUY' 'SELL'

    return 'SELL';
};
