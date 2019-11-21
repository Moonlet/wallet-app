import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Amount } from '../../../../components/amount/amount';
import { Text } from '../../../../library';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../core/blockchain/types';
import { translate } from '../../../../core/i18n';

export interface IExternalProps {
    amount: BigNumber;
    blockchain: Blockchain;
}

export class FeeTotalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Text style={styles.feeTitle}>{translate('App.labels.fee')}</Text>
                <Amount
                    style={styles.fee}
                    amount={this.props.amount}
                    blockchain={this.props.blockchain}
                />
                <View style={styles.containerFeeConverted}>
                    <Text>~</Text>
                    <Amount
                        style={styles.feeConverted}
                        amount={this.props.amount}
                        blockchain={this.props.blockchain}
                        convert
                    />
                </View>
            </View>
        );
    }
}

export const FeeTotal = withTheme(stylesProvider)(FeeTotalComponent);
