import { IScreenModuleWrapperData } from './../../types';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { IScreenModule } from '../../types';
import { getState } from './state-modifiers';

interface IExternalProps {
    module: IScreenModule;
    renderModule: (m: IScreenModule) => void;
    moduleWrapperState?: string;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const wrapperState = getState(state, ownProps.module);
    const wrapperData = (ownProps?.module?.data as IScreenModuleWrapperData)?.data;

    let module = wrapperData?.DEFAULT;
    if (wrapperData[wrapperState]) {
        // TODO: in future we might need to do a deep merge here.
        module = {
            ...module,
            ...wrapperData[wrapperState]
        };
    }

    if (ownProps?.moduleWrapperState && wrapperData[ownProps.moduleWrapperState]) {
        module = {
            ...module,
            ...wrapperData[ownProps.moduleWrapperState]
        };
    }

    return {
        ...ownProps,
        module
    };
};

const ModuleWrapperComponent = (props: IExternalProps) => {
    return props.renderModule(props.module);
};

export const ModuleWrapper = smartConnect<IExternalProps>(ModuleWrapperComponent, [
    connect(mapStateToProps, null)
]);
