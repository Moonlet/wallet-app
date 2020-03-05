import React from 'react';
import { View, ScrollView } from 'react-native';
import { ConversionCard } from '../conversion-card/conversion-card';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { TokenCard } from '../token-card/token-card';
import { ITokenConfig } from '../../core/blockchain/types/token';
import { BASE_DIMENSION } from '../../styles/dimensions';

export interface IProps {
    blockchain: Blockchain;
    account: IAccountState;
    showBottomPadding: boolean;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

const conversionCards = ['USD', 'BTC', 'ETH'];

export const TokenDashboardComponent = (
    props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => (
    <View style={props.styles.container}>
        <View style={props.styles.exchangeCardContainer}>
            {props.blockchain &&
                conversionCards.map(
                    (toCurrency, i) =>
                        getBlockchain(props.blockchain).config.coin !== toCurrency && (
                            <ConversionCard
                                key={i}
                                fromCurrency={getBlockchain(props.blockchain).config.coin}
                                toCurrency={toCurrency}
                                blockchain={props.blockchain}
                            />
                        )
                )}
        </View>

        <ScrollView
            contentContainerStyle={[
                props.styles.scrollContainer,
                { paddingBottom: props.showBottomPadding ? BASE_DIMENSION * 8 : 0 }
            ]}
            showsVerticalScrollIndicator={false}
        >
            {props.account?.tokens &&
                Object.values(props.account.tokens).map(
                    (token: ITokenConfig, index: number) =>
                        token.active && (
                            <TokenCard
                                account={props.account}
                                token={token}
                                navigation={props.navigation}
                                key={`token-${index}`}
                                blockchain={props.blockchain}
                                tokenLogo={token.icon}
                            />
                        )
                )}
        </ScrollView>
    </View>
);
export const TokenDashboard = withTheme(stylesProvider)(TokenDashboardComponent);
