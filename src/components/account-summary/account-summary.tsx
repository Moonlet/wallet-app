import React from 'react';
import { FlatList, TouchableHighlight, View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../styles/dimensions';
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
import { SkeletonPlaceholder } from '../skeleton-placeholder/skeleton-placeholder';

interface IExternalProps {
    isLoading: boolean;
    enableExpand: boolean;
    style?: any;
    data: {
        accountStats: AccountStats;
        blockchain: Blockchain;
        token: ITokenState;
    };
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
        const { data, styles } = this.props;
        const { accountStats, blockchain } = data;

        if (this.props.isLoading) {
            return (
                <View style={styles.detailsContainer}>
                    <SkeletonPlaceholder>
                        {new Array(4).fill('').map(_ => (
                            <View style={styles.detailsSkeletonComp}>
                                <View style={styles.detailsSkeletonIcon} />
                                <View style={{ justifyContent: 'space-between' }}>
                                    <View style={styles.detailsSkeletonPrimaryValue} />
                                    <View style={styles.detailsSkeletonSecondaryValue} />
                                </View>
                            </View>
                        ))}
                    </SkeletonPlaceholder>
                </View>
            );
        }

        if (!accountStats?.chartStats) {
            return null;
        }

        return (
            <View>
                <View style={styles.detailsContainer}>
                    <FlatList
                        data={accountStats.chartStats}
                        keyExtractor={(_, index) => `${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.detailsStatContainer}>
                                <View style={styles.detailsStatIconContainer}>
                                    <Icon
                                        name={item.icon}
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

    private renderPercengateSkeleton() {
        return (
            <View
                style={[
                    this.props.styles.percengateSkeleton,
                    {
                        width: this.state.barWidth
                            ? normalize(this.state.barWidth / 4) - BASE_DIMENSION * 2
                            : normalize(40)
                    }
                ]}
            />
        );
    }

    public render() {
        const { data, isLoading, styles } = this.props;
        const { accountStats } = data;

        const totalCount =
            !isLoading &&
            accountStats?.chartStats.reduce(
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

                    {isLoading ? (
                        <SkeletonPlaceholder>
                            <View
                                style={[styles.barContainer, { borderRadius: BORDER_RADIUS / 2 }]}
                            />
                        </SkeletonPlaceholder>
                    ) : (
                        <View
                            style={styles.barContainer}
                            onLayout={event =>
                                this.setState({ barWidth: event.nativeEvent.layout.width })
                            }
                        >
                            {accountStats?.chartStats.map((stat: IStatValue, index: number) => (
                                <View
                                    key={`stat-bar-${index}`}
                                    style={[
                                        styles.barCard,
                                        {
                                            backgroundColor: stat.color,
                                            width:
                                                this.state.barWidth && stat.data.value !== '0'
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
                    )}

                    <View style={styles.topStatsContainer}>
                        {isLoading ? (
                            <View
                                style={styles.percengateSkeletonContainer}
                                onLayout={event =>
                                    this.setState({ barWidth: event.nativeEvent.layout.width })
                                }
                            >
                                <SkeletonPlaceholder>
                                    {this.renderPercengateSkeleton()}
                                    {this.renderPercengateSkeleton()}
                                    {this.renderPercengateSkeleton()}
                                    {this.renderPercengateSkeleton()}
                                </SkeletonPlaceholder>
                            </View>
                        ) : (
                            accountStats?.chartStats.map((stat: IStatValue, index: number) => (
                                <View
                                    style={styles.percentageSquareContainer}
                                    key={`stat-${index}`}
                                >
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
                                                  .toFixed(0) + `% ${stat.title}`}
                                    </Text>
                                </View>
                            ))
                        )}
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
