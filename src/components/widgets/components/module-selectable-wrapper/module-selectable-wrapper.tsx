import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
    IScreenContext,
    IScreenModule,
    IScreenModuleSelectableWrapperData,
    ISmartScreenActions
} from '../../types';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { getState } from '../module-wrapper/state-modifiers';
import { renderModule } from '../../render-module';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { formatStyles } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    screenKey: string;
    actions: ISmartScreenActions;
}

interface IReduxProps {
    modules: IScreenModule[];
    style: any;
    wrapperState: string;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const wrapperState = getState(state, ownProps.module);
    const wrapperData = ownProps?.module?.data as IScreenModuleSelectableWrapperData;

    return {
        ...ownProps,
        modules: wrapperData?.submodules || [],
        style: wrapperState && wrapperData?.style && wrapperData?.style[wrapperState],
        wrapperState
    };
};

class ModuleSelectableWrapperComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public componentDidMount() {
        this.autoSelectModule();
    }

    public componentDidUpdate(prevProps: IExternalProps & IReduxProps) {
        if (this.props.module && this.props.module !== prevProps.module) {
            this.autoSelectModule();
        }
    }

    private autoSelectModule() {
        const { actions, module } = this.props;

        // Add auto selected modules
        if (
            module?.cta &&
            module?.details?.validator &&
            (module?.data as IScreenModuleSelectableWrapperData)?.state === 'SELECTED'
        ) {
            actions.handleCta(module.cta, {
                screenKey: this.props.screenKey,
                validator: {
                    id: module.details.validator.id,
                    name: module.details.validator.name,
                    icon: module.details.validator?.icon,
                    website: module.details.validator?.website
                }
            });
        }
    }

    public componentWillUnmount() {
        this.props.actions.clearScreenInputData(this.props.screenKey, { validators: [] });
    }

    public render() {
        const { actions, context, module, screenKey, styles } = this.props;

        if (module?.hidden === true) {
            // Hide module
            return null;
        }

        const customStyle = this.props?.style && formatStyles(this.props.style);

        const moduleOptions = {
            screenKey,
            moduleColWrapperContainer: styles.moduleColWrapperContainer,
            moduleWrapperState: this.props.wrapperState
        };

        const moduleJSX = (
            <TouchableOpacity
                onPress={() =>
                    actions.handleCta(module.cta, {
                        screenKey,
                        validator: module?.details?.validator && {
                            id: module.details.validator.id,
                            name: module.details.validator.name,
                            icon: module.details.validator?.icon,
                            website: module.details.validator?.website
                        }
                    })
                }
                activeOpacity={0.8}
            >
                {this.props.modules.map((m: IScreenModule, index: number) => (
                    <View key={`module-${index}`}>
                        {renderModule(m, context, actions, moduleOptions)}
                    </View>
                ))}
            </TouchableOpacity>
        );

        if (customStyle?.gradient) {
            return (
                <LinearGradient
                    colors={customStyle.gradient as any}
                    style={[styles.container, customStyle]}
                >
                    {moduleJSX}
                </LinearGradient>
            );
        } else {
            return <View style={[styles.container, customStyle]}>{moduleJSX}</View>;
        }
    }
}

export const ModuleSelectableWrapper = smartConnect<IExternalProps>(
    ModuleSelectableWrapperComponent,
    [connect(mapStateToProps, null), withTheme(stylesProvider)]
);
