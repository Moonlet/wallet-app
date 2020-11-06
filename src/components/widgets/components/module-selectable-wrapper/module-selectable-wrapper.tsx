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
    actions: any;
    account: IAccountState;
    chainId: ChainIdType;
}

interface IReduxProps {
    modules: IScreenModule[];
    style: any;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const wrapperState = getState(state, ownProps.module);
    const wrapperData = ownProps?.module?.data as IScreenModuleSelectableWrapperData;

    return {
        ...ownProps,
        modules: wrapperData?.submodules || [],
        style: wrapperData?.style[wrapperState]
    };
};

const ModuleSelectableWrapperComponent = (
    props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;

    const customStyle = props?.style && formatStyles(props.style);

    const moduleJSX = (
        <TouchableOpacity
            onPress={() => {
                //
            }}
            activeOpacity={0.8}
        >
            {props.modules.map((module: IScreenModule, index: number) => (
                <View key={`module-${index}`}>
                    {renderModule(module, {
                        account: props.account,
                        chainId: props.chainId,
                        actions: props.actions,
                        moduleColWrapperContainer: styles.moduleColWrapperContainer
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
};

export const ModuleSelectableWrapper = smartConnect<IExternalProps>(
    ModuleSelectableWrapperComponent,
    [connect(mapStateToProps, null), withTheme(stylesProvider)]
);
