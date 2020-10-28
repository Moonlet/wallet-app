import React from 'react';
import { View, Text } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { normalize } from '../../../../styles/dimensions';
import Icon from '../../../icon/icon';
import { formatNumber } from '../../../../core/utils/format-number';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import BigNumber from 'bignumber.js';
import { IBalanceGridData } from '../../types';

interface IExternalProps {
    data: IBalanceGridData[];
}

const BalanceGridIconsComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { data, styles } = props;

    return (
        <View style={styles.container}>
            {data.map((item: IBalanceGridData) => {
                const tokenConfig = getTokenConfig(
                    item.balance.blockchain,
                    item.balance.tokenSymbol
                );

                const balance = getBlockchain(item.balance.blockchain).account.amountFromStd(
                    new BigNumber(item.balance.value),
                    tokenConfig.decimals
                );

                return (
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Icon
                                name={item.icon.value}
                                size={normalize(28)}
                                style={{ color: item.icon.color, alignSelf: 'center' }}
                            />
                        </View>
                        <View style={styles.labelValuesContainer}>
                            <Text style={styles.valueLabel}>
                                {formatNumber(balance, {
                                    currency: item.balance.tokenSymbol,
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                            <Text style={styles.labelText}>{item.label}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

export const BalanceGridIcons = smartConnect<IExternalProps>(BalanceGridIconsComponent, [
    withTheme(stylesProvider)
]);
