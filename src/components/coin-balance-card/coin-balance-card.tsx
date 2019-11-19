import React from 'react';
import { View } from 'react-native';
import { Convert } from '../convert/convert';
import { Text } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import BigNumber from 'bignumber.js';
import { formatAmount } from '../../core/utils/format-amount';
import { Blockchain } from '../../core/blockchain/types';

export interface IProps {
    currency: string;
    blockchain: Blockchain;
    balance: BigNumber;
    toCurrency: string;
    width: number;
    active: boolean;
    styles: ReturnType<typeof stylesProvider>;
}

export const CoinBalanceCardComponent = (props: IProps) => (
    <View style={[props.styles.container, { width: props.width }]}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[props.styles.mainText, !props.active && props.styles.darkerText]} format>
                {formatAmount(props.blockchain, props.balance)}
            </Text>
            <Text style={!props.active && props.styles.darkerText}> {props.currency}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
            <Convert
                from={props.currency}
                to={props.toCurrency}
                style={!props.active && props.styles.darkerText}
                amount={formatAmount(props.blockchain, props.balance)}
                displayCurrency={true}
            />
        </View>
    </View>
);

export const CoinBalanceCard = withTheme(stylesProvider)(CoinBalanceCardComponent);
