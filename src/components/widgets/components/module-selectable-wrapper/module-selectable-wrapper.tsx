import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IScreenModule, IScreenModuleSelectableWrapperData } from '../../types';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { getState } from '../module-wrapper/state-modifiers';
import { renderModule } from '../../render-module';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { formatStyles } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { InfoModal } from '../../../info-modal/info-modal';
import { handleCta } from '../../../../redux/ui/screens/data/actions';
import { clearInput } from '../../../../redux/ui/screens/input-data/actions';

interface IExternalProps {
    module: IScreenModule;
    screenKey: string;
    actions: {
        handleCta: typeof handleCta;
        clearInput: typeof clearInput;
    };
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
        style: wrapperData?.style[wrapperState],
        wrapperState
    };
};

class ModuleSelectableWrapperComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public componentDidMount() {
        const { actions, module } = this.props;

        // Add auto selected modules
        if (
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
        this.props.actions.clearInput(this.props.screenKey, { validators: [] });
    }

    public render() {
        const { actions, module, screenKey, styles } = this.props;

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
                    <View key={`module-${index}`}>{renderModule(m, actions, moduleOptions)}</View>
                ))}
                {module?.info && (
                    <TouchableOpacity
                        style={[
                            styles.infoWrapper,
                            {
                                right:
                                    !module.info?.position || module.info?.position === 'top-right'
                                        ? 0
                                        : undefined,
                                left: module.info?.position === 'top-left' ? 0 : undefined
                            },
                            module?.info?.style && formatStyles(module.info.style)
                        ]}
                        onPress={() => InfoModal.open(module.info.data?.cta?.params?.params)}
                    >
                        {renderModule(module.info.data, actions, moduleOptions)}
                    </TouchableOpacity>
                )}
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
