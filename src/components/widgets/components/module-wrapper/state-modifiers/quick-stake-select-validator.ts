import { IReduxState } from '../../../../../redux/state';
import { IScreenModule, IScreenModuleSelectableWrapperData } from '../../../types';

export const quickStakeSelectValidator = (state: IReduxState, module: IScreenModule): string => {
    const wrapper = module.data as IScreenModuleSelectableWrapperData;

    // TODO
    if (wrapper) {
        //
    }

    // DEFAULT
    // SELECTED

    return wrapper.state;
};
