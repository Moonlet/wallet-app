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
    clearScreenInputData,
    setScreenAmount,
    runScreenValidation
} from '../../../../redux/ui/screens/input-data/actions';
import { formatNumber } from '../../../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../core/blockchain/types';
import { getSelectedBlockchain } from '../../../../redux/wallets/selectors';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { IScreenInputDataValidations } from '../../../../redux/ui/screens/input-data/state';

interface IExternalProps {
    module: IScreenModule;
    screenKey: string;
    actions: {
        runScreenValidation?: typeof runScreenValidation;
    };
    screenValidation: IScreenValidation;
}

interface IReduxProps {
    blockchain: Blockchain;

    inputAmount: string;
    screenAmount: string;
    inputValidation: IScreenInputDataValidations;

    setScreenInputData: typeof setScreenInputData;
    setScreenAmount: typeof setScreenAmount;
    clearScreenInputData: typeof clearScreenInputData;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const screenKey = ownProps?.screenKey;

    return {
        blockchain: getSelectedBlockchain(state),

        inputAmount: screenKey && state.ui.screens.inputData[screenKey]?.inputAmount,
        screenAmount: screenKey && state.ui.screens.inputData[screenKey]?.screenAmount,
        inputValidation: screenKey && state.ui.screens.inputData[screenKey]?.validation
    };
};

const mapDispatchToProps = {
    setScreenInputData,
    setScreenAmount,
    clearScreenInputData
};

class AmountInputComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public componentDidMount() {
        this.props.clearScreenInputData(this.props.screenKey, { amount: '' });
        this.props.setScreenAmount(this.props.screenKey);
    }

    public render() {
        const {
            inputAmount,
            blockchain,
            module,
            inputValidation,
            screenAmount,
            screenKey,
            styles,
            theme
        } = this.props;
        const data = module.data as IAmountInputData;

        const formattedScreenAmount = formatNumber(new BigNumber(screenAmount || '0'), {
            currency: getBlockchain(blockchain).config.coin
        });

        return (
            <View style={[styles.container, formatStyles(module?.style)]}>
                <View style={[styles.inputBox, formatStyles(data?.input?.style)]}>
                    <TextInput
                        testID="enter-amount"
                        style={styles.inputText}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={inputAmount}
                        onChangeText={text => {
                            text = text.replace(/,/g, '.');
                            this.props.setScreenInputData(screenKey, text, 'inputAmount');
                            this.props.actions.runScreenValidation(
                                this.props.screenValidation,
                                screenKey
                            );
                        }}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        // TODO: maxLength - max 8 decimals: 0.00000000
                    />
                </View>

                {data?.label && (
                    <View style={styles.row}>
                        {formatDataJSXElements(data.label, styles.label)}
                        <Text style={styles.amountText}>{formattedScreenAmount}</Text>
                    </View>
                )}

                {inputValidation?.fieldsErrors &&
                    inputValidation.fieldsErrors.map((fieldError, index: number) => {
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
