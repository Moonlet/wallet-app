import React from 'react';
import { View, Text, TextStyle } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../core/theme/with-theme';
export const TopStatsCardComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    const styles = props.styles;

    const renderRow = (title: string, subtitle: string, optionalTextStyle?: TextStyle) => {
        return (
            <View style={styles.column}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.value, optionalTextStyle]}>{subtitle}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderRow('Rank', '13')}
            {renderRow('Validators Elected', '2/2')}
            {renderRow('Group Score', '100.00%')}
            {renderRow('Reward', '6.00%', styles.reward)}
        </View>
    );
};

export const TopStatsCard = withTheme(stylesProvider)(TopStatsCardComponent);
