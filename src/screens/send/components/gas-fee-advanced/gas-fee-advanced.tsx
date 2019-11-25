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

export interface IExternalProps {
    gasPrice: BigNumber;
    gasLimit: BigNumber;
    blockchain: Blockchain;
    onInputFees: (gasPrice: BigNumber, gasLimit: BigNumber) => any;
}
interface IState {
    inputGasPrice: string;
    inputGasLimit: string;
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
                    props.gasPrice,
                    blockchainInstance.config.defaultUnit,
                    blockchainInstance.config.feeOptions.ui.gasPriceUnit
                )
                .toString(),
            inputGasLimit: props.gasLimit.toString()
        };
    }
    public addGasPrice(value: string) {
        const blockchainInstance = getBlockchain(this.props.blockchain);

        this.setState({ inputGasPrice: value });
        this.props.onInputFees(
            blockchainInstance.account.convertUnit(
                new BigNumber(value),
                blockchainInstance.config.feeOptions.ui.gasPriceUnit,
                blockchainInstance.config.defaultUnit
            ),
            new BigNumber(Number(this.state.inputGasLimit))
        );
    }
    public addGasLimit(value: string) {
        const blockchainInstance = getBlockchain(this.props.blockchain);

        this.setState({ inputGasLimit: value });
        this.props.onInputFees(
            blockchainInstance.account.convertUnit(
                new BigNumber(this.state.inputGasPrice),
                blockchainInstance.config.feeOptions.ui.gasPriceUnit,
                blockchainInstance.config.defaultUnit
            ),
            new BigNumber(value)
        );
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;

        return (
            <View style={styles.container}>
                <Text style={styles.gasPriceLabel}>{translate('Fee.gasPrice')}</Text>
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
                        onChangeText={value => {
                            this.addGasPrice(value);
                        }}
                    />
                </View>

                <Text style={styles.gasLimitLabel}>{translate('Fee.gasLimit')}</Text>
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
                        onChangeText={value => {
                            this.addGasLimit(value);
                        }}
                    />
                </View>
                <FeeTotal
                    amount={this.props.gasPrice.multipliedBy(this.props.gasLimit)}
                    blockchain={this.props.blockchain}
                />
            </View>
        );
    }
}

export const GasFeeAvanced = withTheme(stylesProvider)(GasFeeAvancedComponent);
