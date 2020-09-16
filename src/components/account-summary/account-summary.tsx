import React from 'react';
import { FlatList, TouchableHighlight, View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize } from '../../styles/dimensions';
import { translate } from '../../core/i18n/translation/translate';
import { Blockchain } from '../../core/blockchain/types';
import { ITokenState } from '../../redux/wallets/state';
import { AccountStats, IStatValue } from '../../core/blockchain/types/stats';
import BigNumber from 'bignumber.js';
import Icon from '../icon/icon';
import { ExpandableContainer } from '../expandable-container/expandable-container';
import { IconValues } from '../icon/values';
import { Text } from '../../library';
import { statGetValueString } from '../../core/utils/stats-get-value';

interface IExternalProps {
    accountStats: AccountStats;
    blockchain: Blockchain;
    token: ITokenState;
    enableExpand: boolean;
    style?: any;
}

interface IState {
    expanded: boolean;
    barWidth: number;
}

export class AccountSummaryComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            expanded: false,
            barWidth: undefined
        };
    }

    private renderDetailsSection() {
        const { blockchain, styles } = this.props;

        return (
            <View>
                <View style={styles.detailsContainer}>
                    <FlatList
                        data={this.props.accountStats.chartStats}
                        keyExtractor={(_, index) => `${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.detailsStatContainer}>
                                <View style={styles.detailsStatIconContainer}>
                                    <Icon
                                        name={IconValues.VOTE}
                                        size={normalize(25)}
                                        style={{
                                            color: item.color,
                                            alignSelf: 'center'
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.detailsPrimaryText}>
                                        {statGetValueString(item)}
                                    </Text>
                                    <Text style={styles.detailsSecondaryText}>{item.title}</Text>
                                </View>
                            </View>
                        )}
                        numColumns={2}
                    />
                </View>

                {blockchain === Blockchain.ZILLIQA && (
                    <View style={styles.detailsExtraContainer}>
                        <View style={styles.divider} />
                        <View style={styles.detailsExtraTextContainer}>
                            <View style={styles.detailsStatIconContainer}>
                                <Icon
                                    name={IconValues.VOTE}
                                    size={normalize(25)}
                                    style={{
                                        color: this.props.theme.colors.warning,
                                        alignSelf: 'center'
                                    }}
                                />
                            </View>
                            {/* TODO: fix this gZil */}
                            <Text style={styles.detailsExtraText}>{`0.000000000000 gZIL`}</Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        const chartStats = this.props.accountStats.chartStats.filter(
            stat => stat.chartDisplay && stat.chartDisplay === true
        );

        const totalCount = chartStats.reduce(
            (sum, value) => new BigNumber(sum).plus(new BigNumber(value.data.value)),
            new BigNumber(0)
        );

        return (
            <View style={[styles.container, this.props?.style]}>
                <View style={styles.summaryContainer}>
                    <View style={styles.topContainer}>
                        <Text
                            style={
                                this.props.enableExpand
                                    ? styles.summaryText
                                    : styles.summaryTextExpandedDisabled
                            }
                        >
                            {translate('App.labels.summary')}
                        </Text>

                        {this.props.enableExpand && (
                            <TouchableHighlight
                                onPress={() => this.setState({ expanded: !this.state.expanded })}
                                underlayColor={this.props.theme.colors.cardBackground}
                            >
                                <Icon
                                    name={
                                        this.state.expanded
                                            ? IconValues.CHEVRON_UP
                                            : IconValues.CHEVRON_DOWN
                                    }
                                    size={normalize(16)}
                                    style={styles.icon}
                                />
                            </TouchableHighlight>
                        )}
                    </View>

                    <View
                        style={styles.barContainer}
                        onLayout={event =>
                            this.setState({ barWidth: event.nativeEvent.layout.width })
                        }
                    >
                        {chartStats.map((stat: IStatValue, index: number) => (
                            <View
                                key={`stat-bar-${index}`}
                                style={[
                                    styles.barCard,
                                    {
                                        backgroundColor: stat.color,
                                        width: this.state.barWidth
                                            ? Number(
                                                  new BigNumber(stat.data.value)
                                                      .multipliedBy(100)
                                                      .dividedBy(totalCount)
                                                      .multipliedBy(this.state.barWidth)
                                                      .dividedBy(100)
                                                      .toFixed(0)
                                              )
                                            : 0
                                    }
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.topStatsContainer}>
                        {chartStats.map((stat: IStatValue, index: number) => (
                            <View style={styles.percentageSquareContainer} key={`stat-${index}`}>
                                <View
                                    style={[
                                        styles.percentageSquare,
                                        { backgroundColor: stat.color }
                                    ]}
                                />
                                <Text style={styles.percentageText}>
                                    {totalCount.toFixed() === '0'
                                        ? 0 + '%'
                                        : new BigNumber(stat.data.value)
                                              .multipliedBy(100)
                                              .dividedBy(totalCount)
                                              .toFixed(2) + `% ${stat.title}`}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {this.props.enableExpand ? (
                        <ExpandableContainer isExpanded={this.state.expanded}>
                            {this.renderDetailsSection()}
                        </ExpandableContainer>
                    ) : (
                        this.renderDetailsSection()
                    )}
                </View>
            </View>
        );
    }
}

export const AccountSummary = smartConnect<IExternalProps>(AccountSummaryComponent, [
    withTheme(stylesProvider)
]);
