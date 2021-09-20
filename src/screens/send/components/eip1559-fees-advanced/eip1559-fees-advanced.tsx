import React from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Text } from '../../../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { translate } from '../../../../core/i18n';
import { FeeTotal } from '../fee-total/fee-total';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../core/blockchain/types';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { isInteger } from '../../../../core/utils/format-number';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { ITokenState } from '../../../../redux/wallets/state';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export interface IExternalProps {
    token: ITokenState;
    maxPriorityFeePerGas: string;
    maxFeePerGas: string;
    gasLimit: string;
    blockchain: Blockchain;
    onInputFees: (
        maxFeePerGas: string,
        maxPriorityFeePerGas: string,
        gasLimit: string,
        feeTotal: string
    ) => any;
    options?: {
        feeTotalBackgroundColor?: string;
        feeLabelLeftPadding?: number;
    };
}
interface IState {
    inputMaxPriorityFeePerGas: string;
    inputMaxFeePerGas: string;
    inputGasLimit: string;
    displayErrorMaxPriorityFeePerGas: boolean;
    displayErrorMaxFeePerGas: boolean;
    displayErrorGasLimit: boolean;
}
export class Eip1559FeesAvancedComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        const blockchainInstance = getBlockchain(this.props.blockchain);

        this.state = {
            inputMaxPriorityFeePerGas: blockchainInstance.account
                .convertUnit(
                    new BigNumber(props.maxPriorityFeePerGas),
                    blockchainInstance.config.defaultUnit,
                    blockchainInstance.config.feeOptions.ui.gasPriceUnit
                )
                .toString(),
            inputMaxFeePerGas: blockchainInstance.account
                .convertUnit(
                    new BigNumber(props.maxFeePerGas),
                    blockchainInstance.config.defaultUnit,
                    blockchainInstance.config.feeOptions.ui.gasPriceUnit
                )
                .toString(),
            inputGasLimit: props.gasLimit.toString(),
            displayErrorMaxFeePerGas: false,
            displayErrorMaxPriorityFeePerGas: false,
            displayErrorGasLimit: false
        };
    }
    public addMaxFeePerGas(value: string) {
        if (isInteger(value)) {
            this.setState({ displayErrorMaxFeePerGas: false });
        } else {
            this.setState({ displayErrorMaxFeePerGas: true });
        }

        this.setState({ inputMaxFeePerGas: value });

        const maxFeePerGas = new BigNumber(value);
        const gasLimit = new BigNumber(this.state.inputGasLimit);

        const maxPriorityFeePerGas = new BigNumber(this.state.inputMaxPriorityFeePerGas);
        this.props.onInputFees(
            maxFeePerGas.toString(),
            maxPriorityFeePerGas.toString(),
            gasLimit.toString(),
            maxFeePerGas.multipliedBy(gasLimit).toString()
        );
    }

    public addMaxPriorityFeePerGas(value: string) {
        if (isInteger(value)) {
            this.setState({ displayErrorMaxPriorityFeePerGas: false });
        } else {
            this.setState({ displayErrorMaxPriorityFeePerGas: true });
        }

        this.setState({ inputMaxPriorityFeePerGas: value });

        const maxPriorityFeePerGas = new BigNumber(value);

        const gasLimit = new BigNumber(this.state.inputGasLimit);
        const maxFeePerGas = new BigNumber(this.state.inputMaxFeePerGas);

        this.props.onInputFees(
            maxFeePerGas.toString(),
            maxPriorityFeePerGas.toString(),
            gasLimit.toString(),
            maxFeePerGas.multipliedBy(gasLimit).toString()
        );
    }

    public addGasLimit(value: string) {
        if (isInteger(value)) {
            this.setState({ displayErrorGasLimit: false });
        } else {
            this.setState({ displayErrorGasLimit: true });
        }

        const gasLimit = new BigNumber(this.state.inputGasLimit);
        const maxFeePerGas = new BigNumber(this.state.inputMaxFeePerGas);
        const maxPriorityFeePerGas = new BigNumber(this.state.inputMaxPriorityFeePerGas);

        this.props.onInputFees(
            maxFeePerGas.toString(),
            maxPriorityFeePerGas.toString(),
            gasLimit.toString(),
            maxFeePerGas.multipliedBy(gasLimit).toString()
        );
    }

    public render() {
        const { styles, theme, options } = this.props;
        const maxFeePerGas = new BigNumber(this.props.maxFeePerGas);
        // const maxPriorityFeePerGas = new BigNumber(this.props.maxPriorityFeePerGas);
        const gasLimit = new BigNumber(this.props.gasLimit);
        const blockchainInstance = getBlockchain(this.props.blockchain);
        const gasPriceUnit = blockchainInstance.config.feeOptions.ui.gasPriceUnit;
        const defaultUnit = blockchainInstance.config.defaultUnit;

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={[
                            styles.priceLabel,
                            {
                                paddingLeft: options?.feeLabelLeftPadding
                                    ? options.feeLabelLeftPadding
                                    : BASE_DIMENSION * 2
                            }
                        ]}
                    >
                        {translate('Fee.maxPriorityFeePerGas')}
                    </Text>
                    <Text style={styles.gasPriceUnit}>{`(${gasPriceUnit})`}</Text>
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        testID="maxPriorityFeePerGas"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Fee.maxPriorityFeePerGas')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.inputMaxPriorityFeePerGas}
                        onChangeText={value => this.addMaxPriorityFeePerGas(value)}
                        keyboardType={Platform.select({
                            default: 'number-pad',
                            ios: 'decimal-pad'
                        })}
                        returnKeyType="done"
                    />
                </View>

                {this.state.displayErrorMaxPriorityFeePerGas && (
                    <Text style={styles.displayError}>
                        {translate('Fee.errorMaxPriorityFeePerGas')}
                    </Text>
                )}
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={[
                            styles.priceLabel,
                            {
                                paddingLeft: options?.feeLabelLeftPadding
                                    ? options.feeLabelLeftPadding
                                    : BASE_DIMENSION * 2
                            }
                        ]}
                    >
                        {translate('Fee.maxFeePerGas')}
                    </Text>
                    <Text style={styles.gasPriceUnit}>{`(${gasPriceUnit})`}</Text>
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        testID="maxFeePerGas"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Fee.maxFeePerGas')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.inputMaxFeePerGas}
                        onChangeText={value => this.addMaxFeePerGas(value)}
                        keyboardType={Platform.select({
                            default: 'number-pad',
                            ios: 'decimal-pad'
                        })}
                        returnKeyType="done"
                    />
                </View>

                {this.state.displayErrorMaxFeePerGas && (
                    <Text style={styles.displayError}>{translate('Fee.errorMaxFeePerGas')}</Text>
                )}

                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={[
                            styles.priceLabel,
                            {
                                paddingLeft: options?.feeLabelLeftPadding
                                    ? options.feeLabelLeftPadding
                                    : BASE_DIMENSION * 2
                            }
                        ]}
                    >
                        {translate('Fee.gasLimit')}
                    </Text>
                    <Text style={styles.gasPriceUnit}>{`(${defaultUnit})`}</Text>
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        testID="gas-limit"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Fee.gasLimit')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.inputGasLimit.toString()}
                        onChangeText={value => this.addGasLimit(value)}
                        keyboardType={Platform.select({
                            default: 'number-pad',
                            ios: 'decimal-pad'
                        })}
                        returnKeyType="done"
                    />
                </View>

                {this.state.displayErrorGasLimit && (
                    <Text style={styles.displayError}>{translate('Fee.errorLimitPrice')}</Text>
                )}

                <View style={{ marginTop: BASE_DIMENSION }}>
                    <FeeTotal
                        amount={maxFeePerGas.multipliedBy(gasLimit).toString()}
                        blockchain={this.props.blockchain}
                        tokenSymbol={this.props.token.symbol}
                        options={{
                            backgroundColor: this.props.options?.feeTotalBackgroundColor,
                            labelLeftPadding: this.props.options?.feeLabelLeftPadding
                        }}
                    />
                </View>
            </View>
        );
    }
}

export const Eip1559FeesAvanced = smartConnect<IExternalProps>(Eip1559FeesAvancedComponent, [
    withTheme(stylesProvider)
]);
