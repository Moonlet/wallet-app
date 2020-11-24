import React from 'react';
import { View, TextInput } from 'react-native';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IAmountInputData, IScreenValidation } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import { Text } from '../../../../library';
import { IReduxState } from '../../../../redux/state';
import {
    setScreenInputData,
    setScreenAmount,
    runScreenValidation
} from '../../../../redux/ui/screens/input-data/actions';
import { IScreenInputDataValidations } from '../../../../redux/ui/screens/input-data/state';
import { getStateSelectors } from '../ui-state-selectors/index';

interface IExternalProps {
    module: IScreenModule;
    screenKey: string;
    flowId: string;
    actions: {
        runScreenValidation?: typeof runScreenValidation;
    };
    screenValidation: IScreenValidation;
}

interface IReduxProps {
    amount: string;
    inputValidation: IScreenInputDataValidations;

    setScreenInputData: typeof setScreenInputData;
    setScreenAmount: typeof setScreenAmount;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        amount: state.ui.screens.inputData[ownProps.screenKey]?.data?.amount,
        inputValidation: state.ui.screens.inputData[ownProps.screenKey]?.validation,
        ...getStateSelectors(state, ownProps.module, {
            screenKey: ownProps.screenKey,
            flowId: ownProps.flowId
        })
    };
};

const mapDispatchToProps = {
    setScreenInputData,
    setScreenAmount
};

class AmountInputComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public componentDidMount() {
        this.props.setScreenAmount(this.props.screenKey);
    }

    public render() {
        const { amount, module, inputValidation, styles, theme } = this.props;

        const data = module.data as IAmountInputData;

        return (
            <View style={[styles.container, formatStyles(module?.style)]}>
                <View style={[styles.inputBox, formatStyles(data?.input?.style)]}>
                    <TextInput
                        testID="enter-amount"
                        style={styles.inputText}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={amount}
                        onChangeText={text => {
                            text = text.replace(/,/g, '.');
                            // this.props.setScreenInputData(flowId, {
                            //     inputAmount: text
                            // });
                            // this.props.actions.runScreenValidation(
                            //     this.props.screenValidation,
                            //     flowId
                            // );
                        }}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        // TODO: maxLength - max 8 decimals: 0.00000000
                    />
                </View>

                {data?.labels && (
                    <View style={styles.row}>
                        {formatDataJSXElements(
                            data.labels,
                            styles.label,
                            module?.state && { translateKeys: this.props as any }
                        )}
                    </View>
                )}

                {(inputValidation?.fieldsErrors?.amount || []).map((fieldError, index: number) => {
                    if (fieldError.type === 'ERROR_MSG') {
                        return (
                            <Text key={`error-${index}`} style={styles.errorText}>
                                {fieldError.message}
                            </Text>
                        );
                    }

                    if (fieldError.type === 'WARN_MSG') {
                        return (
                            <Text key={`error-${index}`} style={styles.warningText}>
                                {fieldError.message}
                            </Text>
                        );
                    }
                })}
            </View>
        );
    }
}

export const AmountInput = smartConnect<IExternalProps>(AmountInputComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
