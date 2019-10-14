import React from 'react';
import { View } from 'react-native';
import Convert from '../convert/convert';
import { Text } from '../../library/text';

import styles from './style.js';

interface IProps {
    currency: string;
    balance: number;
    toCurrency: string;
    width: number;
    active: boolean;
}

const CoinBalanceCard = (props: IProps) => (
    <View style={[styles.container, { width: props.width }]}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.mainText, !props.active && styles.darkerText]}>
                {props.balance}
            </Text>
            <Text style={!props.active && styles.darkerText}> {props.currency}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
            <Convert
                from={props.currency}
                to={props.toCurrency}
                style={!props.active && styles.darkerText}
            >
                {props.balance}
            </Convert>
            <Text style={!props.active && styles.darkerText}> {props.toCurrency}</Text>
        </View>
    </View>
);

export default CoinBalanceCard;
