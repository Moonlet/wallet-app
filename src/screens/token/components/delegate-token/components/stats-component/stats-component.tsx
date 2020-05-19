import React from 'react';
import { View, FlatList, Platform } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../core/utils/smart-connect';
import { Text } from '../../../../../../library';
import {
    IStatValue,
    IStatValueType,
    AccountStats
} from '../../../../../../core/blockchain/types/stats';
import Pie from '../../../../../../library/pie-chart/pie-chart';
// TODO - fork and move ART library(will be removed in the future warning) to react-native-comunity OR add library within project

export interface IProps {
    accountStats: AccountStats;
}

export class StatsComponentInternal extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public pie: any = React.createRef();

    componentDidMount() {
        if (Platform.OS !== 'web') this.pie.current.animate();
    }
    getValueString(stat: IStatValue) {
        switch (stat.type) {
            case IStatValueType.STRING:
                return stat.data.value;
            case IStatValueType.AMOUNT:
                return stat.data.value + ' ' + stat.data.tokenSymbol; // TODO format text based on blockchain
        }
    }
    getValue(stat: IStatValue) {
        switch (stat.type) {
            case IStatValueType.STRING:
                return stat.data.value;
            case IStatValueType.AMOUNT:
                return stat.data.value;
        }
    }
    renderTopStats() {
        const styles = this.props.styles;
        return this.props.accountStats.topStats.map((stat: IStatValue, i: number) => (
            <View key={i} style={styles.statContainer}>
                <Text style={styles.statLabelText}>{stat.title}</Text>
                <Text style={[styles.statValueText, { color: stat.color }]}>
                    {this.getValueString(stat)}
                </Text>
            </View>
        ));
    }

    renderDetailStats() {
        const styles = this.props.styles;

        return this.props.accountStats.chartStats.map((stat: IStatValue, i: number) => (
            <View key={i + 'secondaryStats'} style={styles.chartDetailsRow}>
                <View key={i + 'secondaryStats-title'} style={styles.detailRowTitle}>
                    <Text style={[styles.chartTextDetailsTitle, { color: stat.color }]}>
                        {stat.title}
                    </Text>
                    {stat.subtitle && (
                        <Text style={[styles.chartTextDetailsSubTitle, { color: stat.color }]}>
                            {stat.subtitle}
                        </Text>
                    )}
                </View>
                <Text style={[styles.chartTextDetails, { color: stat.color }]}>
                    {this.getValueString(stat)}
                </Text>
            </View>
        ));
    }
    renderSecondaryStats() {
        const styles = this.props.styles;
        return this.props.accountStats.secondaryStats.map((stat: IStatValue, i: number) => (
            <View key={i + 'detailStats'} style={styles.chartDetailsRow}>
                <Text key={i + 'label'} style={[styles.chartTextSecondary, { color: stat.color }]}>
                    {stat.title}
                </Text>
                <Text
                    key={i + 'content'}
                    style={[styles.chartTextSecondary, { color: stat.color }]}
                >
                    {this.getValueString(stat)}
                </Text>
            </View>
        ));
    }

    renderChartStats() {
        const styles = this.props.styles;

        const chartStats = this.props.accountStats.chartStats.filter(
            stat => stat.chartDisplay && stat.chartDisplay === true
        );

        const totalCount = chartStats.reduce((sum, value) => sum + Number(value.data.value), 0);

        const pieData = chartStats.map((item, index) => {
            const toRet = {
                value: ((Number(item.data.value) * 100) / totalCount).toFixed(2),
                title: `title-${index}`,
                color: item.color,
                key: `pie-${index}`
            };
            return toRet;
        });

        const chart = (
            <View style={styles.chartView}>
                {Platform.OS === 'web' ? (
                    <View style={styles.dummyView}></View>
                ) : (
                    <Pie
                        ref={this.pie}
                        containerStyle={styles.chartContainer}
                        pieStyle={styles.pieStyle}
                        outerRadius={50}
                        innerRadius={25}
                        data={pieData}
                        animate
                    ></Pie>
                )}
            </View>
        );

        const percentageChart = (
            <FlatList
                data={chartStats}
                keyExtractor={(_, index) => `${index}`}
                renderItem={({ item }) => (
                    <View style={styles.percentageSquareContainer}>
                        <View style={[styles.percentageSquare, { backgroundColor: item.color }]} />
                        <Text style={styles.percentageText}>
                            {((Number(item.data.value) * 100) / totalCount).toFixed(2) + '%'}
                        </Text>
                    </View>
                )}
                numColumns={2}
            />
        );

        const chartWrapper = (
            <View key={'chartWrapper'} style={styles.chartWrapper}>
                {chart}
                {percentageChart}
            </View>
        );

        return [
            chartWrapper,
            <View key={'detailsWrapper'} style={styles.chartDetailsContainer}>
                {this.renderDetailStats()}
                {this.renderSecondaryStats()}
            </View>
        ];
    }
    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={styles.topStatsContainer}>{this.renderTopStats()}</View>
                <View style={styles.chartRowContainer}>{this.renderChartStats()}</View>
            </View>
        );
    }
}

export const StatsComponent = smartConnect<IProps>(StatsComponentInternal, [
    withTheme(stylesProvider)
]);
