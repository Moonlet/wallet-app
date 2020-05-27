import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Amount } from '../../../../components/amount/amount';
import { Text } from '../../../../library';
import { Blockchain } from '../../../../core/blockchain/types';
import { translate } from '../../../../core/i18n';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export interface IExternalProps {
    tokenSymbol: string;
    amount: string;
    blockchain: Blockchain;
    options?: {
        backgroundColor?: string;
        labelLeftPadding?: number;
    };
}

export class FeeTotalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const { styles, options } = this.props;
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.tokenSymbol);

        return (
            <View style={styles.container}>
                <Text
                    style={[
                        styles.feeTitle,
                        {
                            paddingLeft: options?.labelLeftPadding
                                ? options.labelLeftPadding
                                : BASE_DIMENSION * 2
                        }
                    ]}
                >
                    {translate('App.labels.fees')}
                </Text>
                <View
                    style={[
                        styles.feeWrapper,
                        {
                            backgroundColor: options?.backgroundColor
                                ? options.backgroundColor
                                : this.props.theme.colors.cardBackground
                        }
                    ]}
                >
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

export const FeeTotal = smartConnect<IExternalProps>(FeeTotalComponent, [
    withTheme(stylesProvider)
]);
