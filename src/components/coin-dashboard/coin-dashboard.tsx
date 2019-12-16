import React from 'react';
import { View, ScrollView } from 'react-native';
import { ConversionCard } from '../conversion-card/conversion-card';
import { AccountCard } from '../account-card/account-card';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';

export interface IProps {
    blockchain: Blockchain;
    accounts?: IAccountState[];
    styles: ReturnType<typeof stylesProvider>;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const conversionCards = ['USD', 'BTC', 'ETH'];

export const CoinDashboardComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <View style={props.styles.exchangeCardContainer}>
            {props.blockchain &&
                conversionCards.map(
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

        <ScrollView style={{ flex: 1, alignSelf: 'stretch' }}>
            {props.accounts &&
                props.accounts.map((account: IAccountState, i: number) => (
                    <AccountCard
                        account={account}
                        navigation={props.navigation}
                        key={i}
                        blockchain={props.blockchain}
                    />
                ))}
        </ScrollView>
    </View>
);
export const CoinDashboard = withTheme(stylesProvider)(CoinDashboardComponent);
