import { IReduxState } from '../../../../../redux/state';
import { IScreenModule, IScreenModuleWrapperData } from '../../../types';

export const updateClaimPending = (state: IReduxState, module: IScreenModule): IScreenModule => {
    const data = module.data as IScreenModuleWrapperData;

    // TODO
    // state tx

    const finalModule = {
        ...data.data.DEFAULT
    };

    return finalModule;
};
