import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import { TopBar } from '../../components/web-components/top-bar/top-bar';
import { TopStatsCard } from '../../components/web-components/top-stats-card/top-stats-card';
import Icon from '../../components/icon/icon';
import { IconValues } from '../../components/icon/values';
import { normalize } from '../../styles/dimensions';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';

// TODO: Andrei - fetch data from api and add it to redux

export const ConnectWebWalletScreenComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const styles = props.styles;
    const [state, setState] = useState({
        textTop: '',
        amount: '',
        token: { symbol: '', decimals: 0 },
        amount2: '',
        isLoading: true
    });

    useEffect(() => {
        setState({
            textTop: 'Total Votes',
            amount: '3,252,252.59',
            token: { symbol: 'cGLD', decimals: 2 },
            amount2: '5,681,655.99',
            isLoading: true
        });
    }, []);

    const onConnectLedger = () => {
        setState(prevState => ({
            ...prevState,
            isLoading: !prevState.isLoading
        }));
    };

    return (
        <View style={styles.container}>
            <TopBar />

            <View style={styles.topContainer}>
                <Text style={styles.topText}>{state.textTop}</Text>
                <Text style={styles.title}>
                    {state.amount}
                    {state.token.symbol}
                </Text>
                <Text style={styles.subTitle}>${state.amount2}</Text>
            </View>

            <TopStatsCard />

            <View style={styles.connectLedgerContainer}>
                {state.isLoading ? (
                    <TouchableOpacity
                        style={styles.touchableConnect}
                        onPress={() => {
                            onConnectLedger();
                        }}
                    >
                        <View style={styles.connectLedgerButton}>
                            <Icon name={IconValues.LEDGER_LOOGO} size={normalize(6)} />
                            <Text style={styles.connectLedgerText}>Connect Ledger</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <LoadingIndicator />
                        <Text style={styles.loadingText}>
                            Please unlock your ledger and open CELO app
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export const ConnectWebWalletScreen = withTheme(stylesProvider)(ConnectWebWalletScreenComponent);
