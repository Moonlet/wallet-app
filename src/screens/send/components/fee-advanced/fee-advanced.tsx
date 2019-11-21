import React from 'react';
import { View, TextInput } from 'react-native';
import { IAccountState } from '../../../../redux/wallets/state';
import { ITheme } from '../../../../core/theme/itheme';
import stylesProvider from './styles';
import { withTheme } from '../../../../core/theme/with-theme';
import { translate } from '../../../../core/i18n';
import { Fee } from '../fee/fee';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    account: IAccountState;
}
interface IState {
    gasPrice: number;
    gasLimit: number;
}
export class FeeAvancedComponent extends React.Component<IExternalProps & IProps, IState> {
    constructor(props: IExternalProps & IProps) {
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

                <Fee account={this.props.account} />
            </View>
        );
    }
}

export const FeeAvanced = withTheme(stylesProvider)(FeeAvancedComponent);
