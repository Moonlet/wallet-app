import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, normalize } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../core/blockchain/types';
import { Amount } from '../amount/amount';
import { Icon } from '../icon';
import { IAccountState } from '../../redux/wallets/state';
import { formatAddress } from '../../core/utils/format-address';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

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
            <Text style={props.styles.address}>
                {formatAddress(props.selectedAccount.address, props.blockchain)}
            </Text>
        </View>
        <View style={props.styles.rowContainer}>
            <Amount
                style={[props.styles.mainText, !props.active && props.styles.darkerText]}
                amount={props.balance.toString()}
                token={getBlockchain(props.blockchain).config.coin}
                tokenDecimals={
                    getBlockchain(props.blockchain).config.tokens[
                        getBlockchain(props.blockchain).config.coin
                    ].decimals
                }
                blockchain={props.blockchain}
            />
            <Icon name="chevron-down" size={normalize(18)} style={props.styles.icon} />
        </View>
        <Amount
            style={[props.styles.secondaryText, !props.active && props.styles.darkerText]}
            amount={props.balance.toString()}
            token={getBlockchain(props.blockchain).config.coin}
            tokenDecimals={
                getBlockchain(props.blockchain).config.tokens[
                    getBlockchain(props.blockchain).config.coin
                ].decimals
            }
            blockchain={props.blockchain}
            convert
        />
    </TouchableOpacity>
);

export const CoinBalanceCard = withTheme(stylesProvider)(CoinBalanceCardComponent);
