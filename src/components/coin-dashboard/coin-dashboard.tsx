import React from 'react';
import { View, ScrollView } from 'react-native';
import { ConversionCard } from '../conversion-card/conversion-card';
import { AccountCard } from '../account-card/account-card';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { BLOCKCHAIN_INFO } from '../../core/constants/blockchain';
import { Icon } from '../icon';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

export interface IProps {
    blockchain: Blockchain;
    accounts?: IAccountState[];
    styles: ReturnType<typeof stylesProvider>;
}

const conversionCards = ['USD', 'BTC', 'ETH'];

export const CoinDashboardComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <View style={props.styles.exchangeCardContainer}>
            {conversionCards.map(
                (toCurrency, i) =>
                    BLOCKCHAIN_INFO[props.blockchain].coin !== toCurrency && (
                        <ConversionCard
                            key={i}
                            fromCurrency={BLOCKCHAIN_INFO[props.blockchain].coin}
                            toCurrency={toCurrency}
                        />
                    )
            )}
        </View>
        <View style={props.styles.addButton}>
            <Icon name="add" size={25} style={props.styles.icon} />
        </View>
        <ScrollView style={{ flex: 1, alignSelf: 'stretch' }}>
            {props.accounts &&
                props.accounts.map((account: IAccountState, i: number) => (
                    <AccountCard account={account} key={i} blockchain={props.blockchain} />
                ))}
        </ScrollView>
    </View>
);
export const CoinDashboard = withTheme(CoinDashboardComponent, stylesProvider);
