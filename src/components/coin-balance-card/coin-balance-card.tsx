import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../core/blockchain/types';
import { Amount } from '../amount/amount';
import { Icon } from '../icon';
import { IAccountState } from '../../redux/wallets/state';
import { formatAddress } from '../../core/utils/format-address';

export interface IProps {
    onPress?: () => void;
    blockchain: Blockchain;
    selectedAccount: IAccountState;
    balance: BigNumber;
    width?: number;
    active: boolean;
    styles: ReturnType<typeof stylesProvider>;
}

export const CoinBalanceCardComponent = (props: IProps) => (
    <TouchableOpacity
        onPress={() => props.onPress()}
        style={[props.styles.container, { width: props.width }]}
    >
        <View style={props.styles.rowContainer}>
            <Text style={props.styles.account}>
                {props.selectedAccount?.name || `Account ${props.selectedAccount.index + 1}`}
            </Text>
            <Text style={props.styles.address}>{formatAddress(props.selectedAccount.address)}</Text>
        </View>
        <View style={props.styles.rowContainer}>
            <Amount
                style={[props.styles.mainText, !props.active && props.styles.darkerText]}
                amount={props.balance}
                blockchain={props.blockchain}
            />
            <Icon name="arrow-down-1" size={18} style={props.styles.icon} />
        </View>
        <Amount
            style={[props.styles.secondaryText, !props.active && props.styles.darkerText]}
            amount={props.balance}
            blockchain={props.blockchain}
            convert
        />
    </TouchableOpacity>
);

export const CoinBalanceCard = withTheme(stylesProvider)(CoinBalanceCardComponent);
