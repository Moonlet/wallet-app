import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { TopBar } from '../../components/web-components/top-bar/top-bar';
import { TopStatsCard } from '../../components/web-components/top-stats-card/top-stats-card';
import { ChartData } from '../../components/web-components/chart-data/chart-data';

// TODO: Andrei - fetch data from api and add it to redux

export const ChartDataWebComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
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
            <View style={styles.dataContainer}>
                <View style={styles.column}>
                    <ChartData />
                </View>
                <View style={styles.column}></View>
            </View>
        </View>
    );
};

export const ChartDataWebScreen = withTheme(stylesProvider)(ChartDataWebComponent);
