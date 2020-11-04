import { IScreenModule, IScreenModuleSelectableWrapperData } from '../../types';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { getState } from './state-modifiers';

interface IExternalProps {
    module: IScreenModule;
    renderModules: (m: IScreenModule[]) => void;
}

interface IReduxProps {
    modules: IScreenModule[];
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const wrapperState = getState(state, ownProps.module);
    const wrapperData = ownProps?.module?.data as IScreenModuleSelectableWrapperData;

    // user wrapperState for style
    const style = wrapperData?.style[wrapperState];

    if (style) {
        //
    }

    // let module = wrapperData?.DEFAULT;
    // if (wrapperData[wrapperState]) {
    //     // TODO: in future we might need to do a deep merge here.
    //     module = {
    //         ...module,
    //         ...wrapperData[wrapperState]
    //     };
    // }

    // console.log(JSON.stringify(wrapperData.submodules, null, 4));

    return {
        ...ownProps,
        modules: wrapperData?.submodules || []
    };
};

const ModuleSelectableWrapperComponent = (props: IExternalProps & IReduxProps) => {
    return props.renderModules(props?.modules || []);
};

export const ModuleSelectableWrapper = smartConnect<IExternalProps>(
    ModuleSelectableWrapperComponent,
    [connect(mapStateToProps, null)]
);
