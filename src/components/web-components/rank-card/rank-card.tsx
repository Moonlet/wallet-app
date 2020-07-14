import React from 'react';
import { View, Text } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../core/theme/with-theme';

export const RankCardComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    const styles = props.styles;
    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <Text style={styles.title}>Rank</Text>
                <Text style={styles.value}>13</Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.title}>Validators Elected</Text>
                <Text style={styles.value}>2/2</Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.title}>Group Score</Text>
                <Text style={styles.value}>100.00%</Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.title}>Reward</Text>
                <Text style={[styles.value, styles.reward]}>6.00%</Text>
            </View>
        </View>
    );
};

export const RankCard = withTheme(stylesProvider)(RankCardComponent);
