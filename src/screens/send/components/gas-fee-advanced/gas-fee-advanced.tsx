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
    gasPrice: string;
    gasLimit: string;
    blockchain: Blockchain;
    onInputFees: (gasPrice: string, gasLimit: string, feeTotal: string) => any;
    options?: {
        feeTotalBackgroundColor?: string;
        feeLabelLeftPadding?: number;
    };
}
interface IState {
    inputGasPrice: string;
    inputGasLimit: string;
    displayErrorGasPrice: boolean;
    displayErrorGasLimit: boolean;
}
export class GasFeeAvancedComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        const blockchainInstance = getBlockchain(this.props.blockchain);

        this.state = {
            inputGasPrice: blockchainInstance.account
                .convertUnit(
                    new BigNumber(props.gasPrice),
                    blockchainInstance.config.defaultUnit,
                    blockchainInstance.config.feeOptions.ui.gasPriceUnit
                )
                .toString(),
            inputGasLimit: props.gasLimit.toString(),
            displayErrorGasPrice: false,
            displayErrorGasLimit: false
        };
    }
    public addGasPrice(value: string) {
        if (isInteger(value)) {
            this.setState({ displayErrorGasPrice: false });
        } else {
            this.setState({ displayErrorGasPrice: true });
        }

        const blockchainInstance = getBlockchain(this.props.blockchain);

        this.setState({ inputGasPrice: value });

        const gasPrice = blockchainInstance.account.convertUnit(
            new BigNumber(value),
            blockchainInstance.config.feeOptions.ui.gasPriceUnit,
            blockchainInstance.config.defaultUnit
        );
        const gasLimit = new BigNumber(this.state.inputGasLimit);

        this.props.onInputFees(
            gasPrice.toString(),
            gasLimit.toString(),
            gasPrice.multipliedBy(gasLimit).toString()
        );
    }

    public addGasLimit(value: string) {
        if (isInteger(value)) {
            this.setState({ displayErrorGasLimit: false });
        } else {
            this.setState({ displayErrorGasLimit: true });
        }

        const blockchainInstance = getBlockchain(this.props.blockchain);

        const gasPrice = blockchainInstance.account.convertUnit(
            new BigNumber(this.state.inputGasPrice),
            blockchainInstance.config.feeOptions.ui.gasPriceUnit,
            blockchainInstance.config.defaultUnit
        );
        const gasLimit = new BigNumber(value);

        this.setState({ inputGasLimit: value });
        this.props.onInputFees(
            gasPrice.toString(),
            gasLimit.toString(),
            gasPrice.multipliedBy(gasLimit).toString()
        );
    }

    public render() {
        const { styles, theme, options } = this.props;
        const gasPrice = new BigNumber(this.props.gasPrice);
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
                        {translate('Fee.gasPrice')}
                    </Text>
                    <Text style={styles.gasPriceUnit}>{`(${gasPriceUnit})`}</Text>
                </View>

                <View style={styles.inputBox}>
                    <TextInput
                        testID="gas-price"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Fee.gasPrice')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.inputGasPrice}
                        onChangeText={value => this.addGasPrice(value)}
                        keyboardType={Platform.select({
                            default: 'number-pad',
                            ios: 'decimal-pad'
                        })}
                        returnKeyType="done"
                    />
                </View>

                {this.state.displayErrorGasPrice && (
                    <Text style={styles.displayError}>{translate('Fee.errorGasPrice')}</Text>
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
                        amount={gasPrice.multipliedBy(gasLimit).toString()}
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

export const GasFeeAvanced = smartConnect<IExternalProps>(GasFeeAvancedComponent, [
    withTheme(stylesProvider)
]);
