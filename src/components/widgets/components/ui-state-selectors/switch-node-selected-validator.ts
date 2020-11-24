import { IReduxState } from '../../../../redux/state';
import { IScreenModule } from '../../types';

export const getSwitchNodeSelectedValidatorName = (
    state: IReduxState,
    module: IScreenModule,
    options: { flowId: string }
) => {
    return (
        options?.flowId &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[options?.flowId]?.data?.switchNodeValidator?.name
    );
};
