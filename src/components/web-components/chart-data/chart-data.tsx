import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-web-svg-charts';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../core/theme/with-theme';

export const ChartDataComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    const styles = props.styles;

    const [state, setState] = useState({
        data: [],
        colors: []
    });

    useEffect(() => {
        setState({
            data: [30, 40, 70, 30, 40],
            colors: ['#df7ead', '#854520', '#a30956', '#c7d1f4', '#b09ef1']
        });
    }, []);

    const pieData = state.data
        .filter(value => value > 0)
        .map((value, index) => ({
            value,
            svg: {
                fill: state.colors[index]
            },
            key: `pie-${index}`
        }));

    const renderLegend = (item, index) => {
        return (
            <View style={styles.row}>
                <View style={[styles.colorSample, { backgroundColor: state.colors[index] }]} />
                <Text style={styles.text}>{item}%</Text>
            </View>
        );
    };

    return (
        <View>
            <PieChart style={styles.chart} padAngle={0} data={pieData} />
            <View style={styles.row}>
                {state.data.map((item, index) => renderLegend(item, index))}
            </View>
        </View>
    );
};

export const ChartData = withTheme(stylesProvider)(ChartDataComponent);
