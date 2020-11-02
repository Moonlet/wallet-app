import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { IScreenModule, IScreenModuleWrapperData } from '../../types';
import { updateClaimPending } from './utils/update-claim-pending';

export interface IExternalProps {
    module: IScreenModule;
    renderModule: (m: IScreenModule) => void;
}

interface IReduxProps {
    finalModule: IScreenModule;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const stateModifierFn = (ownProps.module.data as IScreenModuleWrapperData).stateModifierFn;

    switch (stateModifierFn) {
        case 'updateClaimPending':
            return {
                ...state,
                finalModule: updateClaimPending(state, ownProps.module)
            };

        default:
            return state;
    }
};

const ModuleWrapperComponent = (props: IExternalProps & IReduxProps) => {
    return props.renderModule(props.finalModule);
};

export const ModuleWrapper = smartConnect<IExternalProps>(ModuleWrapperComponent, [
    connect(mapStateToProps, null)
]);
