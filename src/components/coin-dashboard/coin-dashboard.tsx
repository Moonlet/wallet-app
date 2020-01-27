import React from 'react';
import { View, ScrollView } from 'react-native';
// import { ConversionCard } from '../conversion-card/conversion-card';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
// import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { TokenCard } from '../token-card/token-card';
import { ITokenConfig } from '../../core/blockchain/types/token';

export interface IProps {
    blockchain: Blockchain;
    account: IAccountState;
    styles: ReturnType<typeof stylesProvider>;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

// const conversionCards = ['USD', 'BTC', 'ETH'];

export const CoinDashboardComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <View style={props.styles.exchangeCardContainer}>
            {/* {props.blockchain &&
                conversionCards.map(
                    (toCurrency, i) =>
                        BLOCKCHAIN_INFO[props.blockchain].coin !== toCurrency && (
                            <ConversionCard
                                key={i}
                                fromCurrency={BLOCKCHAIN_INFO[props.blockchain].coin}
                                toCurrency={toCurrency}
                                blockchain={props.blockchain}
                            />
                        )
                )} */}
        </View>

        <ScrollView style={{ flex: 1, alignSelf: 'stretch' }}>
            {props.account?.tokens &&
                Object.values(props.account.tokens).map(
                    (token: ITokenConfig, index: number) =>
                        token.active && (
                            <TokenCard
                                account={props.account}
                                token={token}
                                navigation={props.navigation}
                                key={index}
                                blockchain={props.blockchain}
                                tokenLogo={token.logo}
                            />
                        )
                )}
        </ScrollView>
    </View>
);
export const CoinDashboard = withTheme(stylesProvider)(CoinDashboardComponent);
