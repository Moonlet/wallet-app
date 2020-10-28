import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IBalanceGridData } from '../../types';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { Text } from '../../../../library';
import { formatNumber } from '../../../../core/utils/format-number';
import { SmartImage } from '../../../../library/image/smart-image';

interface IExternalProps {
    data: IBalanceGridData;
}

const SingleBalanceIconComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { data, styles } = props;

    const tokenConfig = getTokenConfig(data.balance.blockchain, data.balance.tokenSymbol);

    const balance = getBlockchain(data.balance.blockchain).account.amountFromStd(
        new BigNumber(data.balance.value),
        tokenConfig.decimals
    );

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <SmartImage source={{ uri: data.icon.value }} />
            </View>
            <Text style={styles.labelText}>
                {formatNumber(balance, {
                    currency: data.balance.tokenSymbol,
                    maximumFractionDigits: tokenConfig.ui.decimals
                })}
            </Text>
        </View>
    );
};

export const SingleBalanceIcon = smartConnect<IExternalProps>(SingleBalanceIconComponent, [
    withTheme(stylesProvider)
]);
