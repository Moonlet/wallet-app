import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { Text } from '../../../../library';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import { SmartImage } from '../../../../library/image/smart-image';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { formatNumber } from '../../../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { formatValidatorName } from '../../../../core/utils/format-string';

export interface IExternalProps {
    validator: IValidator;
    amount: string;
    symbol: string;
}

export const ValidatorDelegateAmountComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const styles = props.styles;

    return (
        <View style={styles.container}>
            <SmartImage source={{ uri: props.validator.icon }} style={styles.icon} />
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelName}>
                        {formatValidatorName(props.validator.name, 15)}
                    </Text>
                    <Text style={styles.rankText}>{props.validator.rank}</Text>
                </View>
                <Text style={styles.website}>{props.validator.website}</Text>
            </View>
            <Text style={styles.amount}>
                {props.amount === '0' || props.amount === undefined
                    ? `_.____ ${props.symbol}`
                    : formatNumber(new BigNumber(props.amount), {
                          currency: props.symbol,
                          minimumFractionDigits: 2
                      })}
            </Text>
        </View>
    );
};

export const ValidatorDelegateAmount = smartConnect<IExternalProps>(
    ValidatorDelegateAmountComponent,
    [withTheme(stylesProvider)]
);
