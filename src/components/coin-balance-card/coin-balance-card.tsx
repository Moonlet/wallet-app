import React from 'react';
import { View } from 'react-native';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../core/blockchain/types';
import { Amount } from '../amount/amount';

export interface IProps {
    blockchain: Blockchain;
    balance: BigNumber;
    width: number;
    active: boolean;
    styles: ReturnType<typeof stylesProvider>;
}

export const CoinBalanceCardComponent = (props: IProps) => (
    <View style={[props.styles.container, { width: props.width }]}>
        <Amount
            style={[props.styles.mainText, !props.active && props.styles.darkerText]}
            amount={props.balance}
            blockchain={props.blockchain}
        />
        <View style={{ flexDirection: 'row' }}>
            <Amount
                style={!props.active && props.styles.darkerText}
                amount={props.balance}
                blockchain={props.blockchain}
                convert
            />
        </View>
    </View>
);

export const CoinBalanceCard = withTheme(stylesProvider)(CoinBalanceCardComponent);
