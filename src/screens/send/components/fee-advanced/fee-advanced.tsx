import React from 'react';
import { View, TextInput } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { translate } from '../../../../core/i18n';
import { FeeTotal } from '../fee-total/fee-total';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../core/blockchain/types';

export interface IExternalProps {
    amount: BigNumber;
    blockchain: Blockchain;
}
interface IState {
    gasPrice: number;
    gasLimit: number;
}
export class FeeAvancedComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            gasPrice: undefined,
            gasLimit: undefined
        };
    }
    public addGasPrice(value: string) {
        throw new Error('Method not implemented.');
    }
    public addGasLimit(value: string) {
        throw new Error('Method not implemented.');
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        return (
            <View style={styles.container}>
                <View style={[styles.inputBox, styles.inputBoxTop]}>
                    <TextInput
                        testID="gas-price"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Fee.gasPrice')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.gasPrice ? this.state.gasPrice.toString() : ''}
                        onChangeText={value => {
                            this.addGasPrice(value);
                        }}
                    />
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
                        value={this.state.gasLimit ? this.state.gasLimit.toString() : ''}
                        onChangeText={value => {
                            this.addGasLimit(value);
                        }}
                    />
                </View>
                <FeeTotal amount={this.props.amount} blockchain={this.props.blockchain} />
            </View>
        );
    }
}

export const FeeAvanced = withTheme(stylesProvider)(FeeAvancedComponent);
