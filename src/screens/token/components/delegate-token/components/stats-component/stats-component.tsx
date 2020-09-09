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
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../../../core/blockchain/types';
import { getBlockchain } from '../../../../../../core/blockchain/blockchain-factory';
import { ITokenState } from '../../../../../../redux/wallets/state';
import { getTokenConfig } from '../../../../../../redux/tokens/static-selectors';
import { formatNumber } from '../../../../../../core/utils/format-number';
// TODO - fork and move ART library(will be removed in the future warning) to react-native-comunity OR add library within project

export interface IProps {
    accountStats: AccountStats;
    blockchain: Blockchain;
    token: ITokenState;
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
            case IStatValueType.AMOUNT: {
                const tokenConfig = getTokenConfig(
                    stat.data.blockchain as Blockchain,
                    stat.data.tokenSymbol
                );
                const blockchainInstance = getBlockchain(stat.data.blockchain as Blockchain);

                const amountFromStd = blockchainInstance.account.amountFromStd(
                    new BigNumber(stat.data.value),
                    tokenConfig.decimals
                );
                return formatNumber(new BigNumber(amountFromStd), {
                    currency: blockchainInstance.config.coin,
                    maximumFractionDigits: 4
                });
            }
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

        const totalCount = chartStats.reduce(
            (sum, value) => new BigNumber(sum).plus(new BigNumber(value.data.value)),
            new BigNumber(0)
        );

        const pieData = chartStats.map((item, index) => {
            const toRet = {
                value: new BigNumber(item.data.value)
                    .multipliedBy(100)
                    .dividedBy(totalCount)
                    .toFixed(2),
                title: `title-${index}`,
                color: item.color,
                key: `pie-${index}`
            };
            return toRet;
        });

        const chart = (
            <View style={styles.chartView}>
                {Platform.OS === 'web' ? (
                    <View style={styles.dummyView} />
                ) : (
                    <Pie
                        ref={this.pie}
                        containerStyle={styles.chartContainer}
                        pieStyle={styles.pieStyle}
                        outerRadius={50}
                        innerRadius={25}
                        data={pieData}
                        animate
                    />
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
                            {totalCount.toFixed() === '0'
                                ? 0 + '%'
                                : new BigNumber(item.data.value)
                                      .multipliedBy(100)
                                      .dividedBy(totalCount)
                                      .toFixed(2) + '%'}
                        </Text>
                    </View>
                )}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
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
                {this.props.accountStats.topStats.length > 0 && (
                    <View style={styles.topStatsContainer}>{this.renderTopStats()}</View>
                )}
                <View style={styles.chartRowContainer}>{this.renderChartStats()}</View>
            </View>
        );
    }
}

export const StatsComponent = smartConnect<IProps>(StatsComponentInternal, [
    withTheme(stylesProvider)
]);
