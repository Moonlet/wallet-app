import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IScreenModule, IScreenModuleSelectableWrapperData } from '../../types';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { getState } from '../module-wrapper/state-modifiers';
import { renderModule } from '../../render-module';
import { IAccountState } from '../../../../redux/wallets/state';
import { ChainIdType } from '../../../../core/blockchain/types';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { formatStyles } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { InfoModal } from '../../../info-modal/info-modal';
import { handleCta } from '../../handle-cta';

interface IExternalProps {
    module: IScreenModule;
    screenKey: string;
    actions: any;
    account: IAccountState;
    chainId: ChainIdType;
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
            module?.details?.validatorId &&
            module?.details?.validatorName &&
            (module?.data as IScreenModuleSelectableWrapperData)?.state === 'SELECTED'
        ) {
            handleCta(module.cta, {
                actions,
                screenKey: this.props.screenKey,
                validatorId: module.details.validatorId,
                validatorName: module.details.validatorName
            });
        }
    }

    public componentWillUnmount() {
        this.props.actions.clearInput(this.props.screenKey, { validators: [] });
    }

    public render() {
        const { actions, module, styles } = this.props;

        const customStyle = this.props?.style && formatStyles(this.props.style);

        const moduleOptions = {
            account: this.props.account,
            chainId: this.props.chainId,
            actions,
            moduleColWrapperContainer: styles.moduleColWrapperContainer,
            moduleWrapperState: this.props.wrapperState
        };

        const moduleJSX = (
            <TouchableOpacity
                onPress={() =>
                    handleCta(module.cta, {
                        actions,
                        screenKey: this.props.screenKey,
                        validatorId: module?.details?.validatorId,
                        validatorName: module?.details?.validatorName
                    })
                }
                activeOpacity={0.8}
            >
                {this.props.modules.map((m: IScreenModule, index: number) => (
                    <View key={`module-${index}`}>{renderModule(m, moduleOptions)}</View>
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
                        {renderModule(module.info.data, moduleOptions)}
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
