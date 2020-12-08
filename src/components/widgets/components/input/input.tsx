import React from 'react';
import { View, TextInput } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IInputData, IScreenModule, ISmartScreenActions } from '../../types';
import { formatStyles } from '../../utils';
import { connect } from 'react-redux';
import { IReduxState } from '../../../../redux/state';

interface IExternalProps {
    module: IScreenModule;
    actions: ISmartScreenActions;
    options?: {
        screenKey?: string;
        flowId?: string;
    };
}

interface IReduxProps {
    input: string;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const key =
        ownProps.options?.flowId || ownProps.module?.details?.flowId || ownProps.options?.screenKey;

    return {
        input: state.ui.screens.inputData && state.ui.screens.inputData[key]?.data?.input
    };
};

const InputModuleComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { input, module, options, styles, theme } = props;
    const data = module.data as IInputData;

    const key = options?.flowId || module?.details?.flowId || options?.screenKey;

    return (
        <View style={[styles.container, formatStyles(module?.style)]}>
            <View style={[styles.inputBox, formatStyles(data?.style?.inputContainer)]}>
                <TextInput
                    style={[styles.inputText, formatStyles(data?.style?.input)]}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    selectionColor={theme.colors.accent}
                    placeholder={data?.options?.placeholder?.value}
                    placeholderTextColor={
                        data?.options?.placeholder?.color || theme.colors.textTertiary
                    }
                    value={input}
                    onChangeText={text => {
                        props.actions.setScreenInputData(key, {
                            input: text
                        });
                    }}
                    keyboardType={(data?.options?.keyboardType as any) || 'default'}
                    returnKeyType="done"
                    multiline={data?.options?.multiline || true}
                />
            </View>
        </View>
    );
};

export const InputModule = smartConnect<IExternalProps>(InputModuleComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
