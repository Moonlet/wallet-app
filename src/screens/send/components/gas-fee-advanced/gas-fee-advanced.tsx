import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '../../../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { translate } from '../../../../core/i18n';
import { FeeTotal } from '../fee-total/fee-total';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../core/blockchain/types';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { ITokenConfig } from '../../../../core/blockchain/types/token';
import { isNumeric } from '../../../../core/utils/format-number';

export interface IExternalProps {
    token: ITokenConfig;
    gasPrice: string;
    gasLimit: string;
    blockchain: Blockchain;
    onInputFees: (gasPrice: string, gasLimit: string, feeTotal: string) => any;
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
        if (isNumeric(value)) {
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
        if (isNumeric(value)) {
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
        const styles = this.props.styles;
        const theme = this.props.theme;
        const gasPrice = new BigNumber(this.props.gasPrice);
        const gasLimit = new BigNumber(this.props.gasLimit);

        return (
            <View style={styles.container}>
                <Text style={styles.priceLabel}>{translate('Fee.gasPrice')}</Text>

                <View style={[styles.inputBox, styles.inputBoxTop]}>
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
                        keyboardType="decimal-pad"
                    />
                </View>
                {this.state.displayErrorGasPrice && (
                    <Text style={styles.displayError}>{translate('Fee.errorGasPrice')}</Text>
                )}

                <Text style={styles.priceLabel}>{translate('Fee.gasLimit')}</Text>

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
                        keyboardType="decimal-pad"
                    />
                </View>
                {this.state.displayErrorGasLimit && (
                    <Text style={styles.displayError}>{translate('Fee.errorLimitPrice')}</Text>
                )}

                <FeeTotal
                    amount={gasPrice.multipliedBy(gasLimit).toString()}
                    blockchain={this.props.blockchain}
                    token={this.props.token}
                />
            </View>
        );
    }
}

export const GasFeeAvanced = withTheme(stylesProvider)(GasFeeAvancedComponent);
