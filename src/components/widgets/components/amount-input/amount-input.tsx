import React from 'react';
import { View, TextInput, Platform, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import {
    IScreenModule,
    IAmountInputData,
    IScreenValidation,
    IScreenContext,
    ISmartScreenActions,
    IAmountInputAmountBox
} from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import { Text } from '../../../../library';
import { IReduxState } from '../../../../redux/state';
import {
    setScreenInputData,
    setScreenAmount
} from '../../../../redux/ui/screens/input-data/actions';
import { IScreenInputDataValidations } from '../../../../redux/ui/screens/input-data/state';
import { getStateSelectors } from '../ui-state-selectors/index';
import BigNumber from 'bignumber.js';
import isEqual from 'lodash/isEqual';
import { Capitalize } from '../../../../core/utils/format-string';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    screenKey: string;
    actions: ISmartScreenActions;
    screenValidation: IScreenValidation;
}

interface IReduxProps {
    amount: string;
    inputValidation: IScreenInputDataValidations;
    amountBox: IAmountInputAmountBox;

    setScreenInputData: typeof setScreenInputData;
    setScreenAmount: typeof setScreenAmount;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        amount: state.ui.screens.inputData[ownProps.screenKey]?.data?.amount,
        inputValidation: state.ui.screens.inputData[ownProps.screenKey]?.validation,
        amountBox: state.ui.screens.inputData[ownProps.screenKey]?.data?.amountBox,

        ...getStateSelectors(state, ownProps.module, {
            screenKey: ownProps.screenKey,
            flowId: ownProps.context?.flowId
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
        this.props.actions.clearScreenInputData(this.props.screenKey, {
            amount: undefined
        });

        if (this.props.module?.state?.actions) {
            this.props.actions.runScreenStateActions({
                actions: this.props.module.state.actions,
                context: this.props.context,
                screenKey: this.props.screenKey
            });
        }
    }

    private renderAmountComp(amount: IAmountInputAmountBox, index: number) {
        const { amountBox, styles } = this.props;

        const isSelected = amountBox && isEqual(amountBox, amount);

        let label = '';
        if (amount.type === 'percentage') label = `${amount.value}%`;
        if (amount.type === 'value') {
            if (typeof amount.value === 'number') label = `+${amount.value}`;
            if (typeof amount.value === 'string') label = Capitalize(amount.value);
        }

        return (
            <TouchableOpacity
                key={`amount-comp-${index}`}
                style={[
                    styles.amountComp,
                    isSelected && styles.amountCompSelected,
                    index === 0 && { marginLeft: 0 },
                    index === (this.props.module.data as IAmountInputData).amounts.length - 1 && {
                        marginRight: 0
                    }
                ]}
                activeOpacity={0.8}
                onPress={() => {
                    switch (amount.type) {
                        case 'percentage': {
                            const newAmount = new BigNumber((this.props as any).allBalance)
                                .multipliedBy(
                                    new BigNumber(amount.value).dividedBy(new BigNumber(100))
                                )
                                .toFixed();

                            this.props.setScreenAmount(newAmount, {
                                screenKey: this.props.screenKey,
                                context: this.props.context
                            });

                            this.props.setScreenInputData(this.props.screenKey, {
                                amountBox: amount
                            });
                            break;
                        }

                        case 'value': {
                            if (typeof amount.value === 'number') {
                                const newAmount = new BigNumber(
                                    isNaN(Number(this.props.amount)) || this.props.amount === ''
                                        ? 0
                                        : this.props.amount
                                ).plus(new BigNumber(amount.value));

                                this.props.setScreenAmount(newAmount.toFixed(), {
                                    screenKey: this.props.screenKey,
                                    context: this.props.context
                                });
                            }

                            if (typeof amount.value === 'string') {
                                // All balance
                                let newAmount = new BigNumber((this.props as any).allBalance);

                                // Half balance
                                if (amount.value === 'half') {
                                    newAmount = newAmount.dividedBy(new BigNumber(2));
                                }

                                this.props.setScreenAmount(newAmount.toFixed(), {
                                    screenKey: this.props.screenKey,
                                    context: this.props.context
                                });
                            }

                            break;
                        }

                        default:
                            break;
                    }
                }}
            >
                <Text style={[styles.amountCompText, isSelected && styles.amountCompTextSelected]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    }

    public render() {
        const { amount, module, inputValidation, styles, theme } = this.props;

        const data = module.data as IAmountInputData;

        let editable = true;
        if (data?.editable !== undefined) editable = data.editable;

        return (
            <View style={[styles.container, formatStyles(module?.style)]}>
                {data?.input && (
                    <View style={[styles.inputBox, formatStyles(data?.input?.style)]}>
                        <TextInput
                            testID="enter-amount"
                            style={[styles.inputText, formatStyles(data?.input?.textStyle)]}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            selectionColor={theme.colors.accent}
                            placeholder={data?.placeholder?.value}
                            placeholderTextColor={
                                data?.placeholder?.color || theme.colors.textTertiary
                            }
                            value={amount}
                            onChangeText={text => {
                                text = text.replace(/,/g, '.');
                                this.props.setScreenAmount(text, {
                                    screenKey: this.props.screenKey,
                                    context: this.props.context
                                });
                            }}
                            keyboardType={Platform.select({
                                default: 'number-pad',
                                ios: 'decimal-pad'
                            })}
                            returnKeyType="done"
                            // TODO: maxLength - max 8 decimals: 0.00000000
                            editable={editable}
                        />
                    </View>
                )}

                {data?.labels && (
                    <View style={styles.row}>
                        {formatDataJSXElements(
                            data.labels,
                            styles.label,
                            module?.state && { translateKeys: this.props as any }
                        )}
                    </View>
                )}

                {data?.amounts && (
                    <View style={styles.amountsContainer}>
                        {data.amounts.map((a: IAmountInputAmountBox, index: number) =>
                            this.renderAmountComp(a, index)
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
