import React from 'react';
import { View } from 'react-native';
import Convert from '../convert/convert';
import { Text } from '../../library/text';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

interface IProps {
    currency: string;
    balance: number;
    toCurrency: string;
    width: number;
    active: boolean;
    styles: ReturnType<typeof stylesProvider>;
}

export const CoinBalanceCardComponent = (props: IProps) => (
    <View style={[props.styles.container, { width: props.width }]}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[props.styles.mainText, !props.active && props.styles.darkerText]}>
                {props.balance}
            </Text>
            <Text style={!props.active && props.styles.darkerText}> {props.currency}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
            <Convert
                from={props.currency}
                to={props.toCurrency}
                style={!props.active && props.styles.darkerText}
            >
                {props.balance}
            </Convert>
            <Text style={!props.active && props.styles.darkerText}> {props.toCurrency}</Text>
        </View>
    </View>
);

export const CoinBalanceCard = withTheme(CoinBalanceCardComponent, stylesProvider);
