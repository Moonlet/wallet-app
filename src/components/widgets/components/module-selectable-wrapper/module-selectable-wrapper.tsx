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
            (module?.data as IScreenModuleSelectableWrapperData)?.state === 'SELECTED'
        ) {
            actions.quickStakeValidatorMultipleSelection(
                this.props.screenKey,
                module.details.validatorId
            );
        }
    }

    public componentWillUnmount() {
        // Is this the best place to handle this?
        this.props.actions.quickStakeValidatorClearSelection(this.props.screenKey);
    }

    public render() {
        const { actions, styles } = this.props;

        const customStyle = this.props?.style && formatStyles(this.props.style);

        const moduleJSX = (
            <TouchableOpacity
                onPress={() => {
                    if (this.props.module?.cta) {
                        if (this.props.module.cta.type === 'callAction') {
                            switch (this.props.module.cta.params.action) {
                                case 'MULTIPLE_SELECTION':
                                    if (this.props.module?.details?.validatorId) {
                                        actions.quickStakeValidatorMultipleSelection(
                                            this.props.screenKey,
                                            this.props.module.details.validatorId
                                        );
                                    }
                                    break;

                                case 'SINGLE_SELECTION':
                                    if (this.props.module?.details?.validatorId) {
                                        actions.quickStakeValidatorSingleSelection(
                                            this.props.screenKey,
                                            this.props.module.details.validatorId
                                        );
                                    }
                                    break;

                                default:
                                    break;
                            }
                        }
                    }
                }}
                activeOpacity={0.8}
            >
                {this.props.modules.map((module: IScreenModule, index: number) => (
                    <View key={`module-${index}`}>
                        {renderModule(module, {
                            account: this.props.account,
                            chainId: this.props.chainId,
                            actions,
                            moduleColWrapperContainer: styles.moduleColWrapperContainer,
                            moduleWrapperState: this.props.wrapperState
                        })}
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
