import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Amount } from '../../../../components/amount/amount';
import { Text } from '../../../../library';
import { Blockchain } from '../../../../core/blockchain/types';
import { translate } from '../../../../core/i18n';
import { ITokenState } from '../../../../redux/tokens/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';

export interface IExternalProps {
    token: ITokenState;
    amount: string;
    blockchain: Blockchain;
}

export class FeeTotalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const styles = this.props.styles;
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        return (
            <View style={styles.container}>
                <Text style={styles.feeTitle}>{translate('App.labels.fees')}</Text>
                <View style={styles.feeWrapper}>
                    <Amount
                        style={styles.fee}
                        amount={this.props.amount}
                        blockchain={this.props.blockchain}
                        token={tokenConfig.symbol}
                        tokenDecimals={tokenConfig.decimals}
                    />
                </View>
                <View style={styles.containerFeeConverted}>
                    <Text style={styles.approxSign}>~</Text>
                    <Amount
                        style={styles.feeConverted}
                        amount={this.props.amount}
                        blockchain={this.props.blockchain}
                        token={tokenConfig.symbol}
                        tokenDecimals={tokenConfig.decimals}
                        convert
                    />
                </View>
            </View>
        );
    }
}

export const FeeTotal = withTheme(stylesProvider)(FeeTotalComponent);
