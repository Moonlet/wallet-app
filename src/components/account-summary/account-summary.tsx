import React from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize } from '../../styles/dimensions';
import { translate } from '../../core/i18n/translation/translate';
import { Blockchain } from '../../core/blockchain/types';
import { ITokenState } from '../../redux/wallets/state';
import { AccountStats } from '../../core/blockchain/types/stats';
import BigNumber from 'bignumber.js';
import Icon from '../icon/icon';
import { ExpandableContainer } from '../expandable-container/expandable-container';
import { IconValues } from '../icon/values';
import { Text } from '../../library';
import { statGetValueString } from '../../core/utils/stats-get-value';
import { SkeletonPlaceholder } from '../skeleton-placeholder/skeleton-placeholder';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { TokenScreenComponentType } from '../../core/blockchain/types/token';
import { formatNumber } from '../../core/utils/format-number';
import { SmartImage } from '../../library/image/smart-image';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

interface IExternalProps {
    isLoading: boolean;
    enableExpand: boolean;
    style?: any;
    data: {
        accountStats: AccountStats;
        blockchain: Blockchain;
        token: ITokenState;
        extraToken?: ITokenState;
    };
}

interface IState {
    expanded: boolean;
    barWidth: number;
    hideComponent: boolean;
    extraTokenAmount: BigNumber;
}

export class AccountSummaryComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            expanded: false,
            barWidth: undefined,
            hideComponent: true,
            extraTokenAmount: undefined
        };
    }

    public componentDidMount() {
        this.handleComponentVisibility();
        this.handleExtraToken();
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.data !== prevProps.data) {
            this.handleComponentVisibility();
            this.handleExtraToken();
        }
        if (this.props.data.blockchain !== prevProps.data.blockchain) {
            this.setState({ expanded: false });
        }
    }

    private handleComponentVisibility() {
        const tokenConfig =
            this.props.data?.token &&
            getTokenConfig(this.props.data.blockchain, this.props.data.token.symbol);

        if (tokenConfig?.ui.tokenScreenComponent === TokenScreenComponentType.DELEGATE) {
            this.setState({ hideComponent: false });
        } else {
            this.setState({ hideComponent: true });
        }
    }

    private handleExtraToken() {
        const { data } = this.props;
        const { blockchain } = data;

        const extraTokenConfig =
            data?.extraToken && getTokenConfig(blockchain, data.extraToken.symbol);

        const amountFromStd =
            data?.extraToken &&
            getBlockchain(blockchain).account.amountFromStd(
                new BigNumber(data.extraToken.balance.value),
                extraTokenConfig.decimals
            );

        this.setState({ extraTokenAmount: amountFromStd });
    }

    private renderDetailsSection() {
        const { data, styles } = this.props;
        const { accountStats, blockchain } = data;

        if (this.props.isLoading) {
            return (
                <View style={styles.detailsContainer}>
                    <SkeletonPlaceholder>
                        {new Array(4).fill('').map((_, index: number) => (
                            <View key={`skelet-${index}`} style={styles.detailsSkeletonComp}>
                                <View style={styles.detailsSkeletonIcon} />
                                <View style={{ justifyContent: 'space-between' }}>
                                    <View style={styles.detailsSkeletonPrimaryValue} />
                                    <View style={styles.detailsSkeletonSecondaryValue} />
                                </View>
                            </View>
                        ))}
                    </SkeletonPlaceholder>

                    {data.extraToken && (
                        <View style={styles.detailsExtraPlaceholderWrapper}>
                            <View style={styles.divider} />

                            <View
                                style={[
                                    styles.detailsExtraTextContainer,
                                    styles.detailsExtraPlaceholderContainer
                                ]}
                            >
                                <SkeletonPlaceholder>
                                    <View style={styles.detailsSkeletonIcon} />
                                    <View
                                        style={[
                                            styles.detailsSkeletonPrimaryValue,
                                            { width: normalize(160) }
                                        ]}
                                    />
                                </SkeletonPlaceholder>
                            </View>
                        </View>
                    )}
                </View>
            );
        }

        if (!accountStats?.chartStats) {
            return null;
        }

        const tokenConfig = data?.token && getTokenConfig(blockchain, data.token.symbol);

        const extraTokenConfig =
            data?.extraToken && getTokenConfig(blockchain, data.extraToken.symbol);

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
                                        {statGetValueString(item, tokenConfig)}
                                    </Text>
                                    <Text style={styles.detailsSecondaryText}>{item.title}</Text>
                                </View>
                            </View>
                        )}
                        numColumns={2}
                    />
                </View>

                {this.state.extraTokenAmount && extraTokenConfig && (
                    <View style={styles.detailsExtraContainer}>
                        <View style={styles.divider} />
                        <View style={styles.detailsExtraTextContainer}>
                            <SmartImage
                                source={extraTokenConfig.icon}
                                style={styles.extraTokenIcon}
                            />

                            <Text style={styles.detailsExtraText}>
                                {`${formatNumber(this.state.extraTokenAmount, {
                                    currency: data.extraToken.symbol,
                                    maximumFractionDigits: extraTokenConfig.ui.decimals
                                })}`}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    // private renderPercengateSkeleton() {
    //     return (
    //         <View
    //             style={[
    //                 this.props.styles.percengateSkeleton,
    //                 {
    //                     width: this.state.barWidth
    //                         ? normalize(this.state.barWidth / 4) - BASE_DIMENSION * 2
    //                         : normalize(40)
    //                 }
    //             ]}
    //         />
    //     );
    // }

    public render() {
        const { styles } = this.props;
        // const { accountStats } = data;

        if (this.state.hideComponent) {
            return null;
        }

        // const totalCount =
        //     !isLoading &&
        //     accountStats?.chartStats.reduce(
        //         (sum, value) => new BigNumber(sum).plus(new BigNumber(value.data.value)),
        //         new BigNumber(0)
        //     );

        return (
            <View style={[styles.container, this.props?.style]}>
                <TouchableOpacity
                    style={styles.summaryContainer}
                    onPress={() => this.setState({ expanded: !this.state.expanded })}
                    activeOpacity={1}
                >
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
                            <View style={styles.arrowContainer}>
                                <Icon
                                    name={
                                        this.state.expanded
                                            ? IconValues.CHEVRON_UP
                                            : IconValues.CHEVRON_DOWN
                                    }
                                    size={normalize(16)}
                                    style={styles.icon}
                                />
                            </View>
                        )}
                    </View>

                    {/* {isLoading ? (
                        <SkeletonPlaceholder>
                            <View style={styles.barContainer} />
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
                    )} */}

                    {/* <View style={styles.topStatsContainer}>
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
                    </View> */}

                    {this.props.enableExpand ? (
                        <ExpandableContainer isExpanded={this.state.expanded}>
                            {this.renderDetailsSection()}
                        </ExpandableContainer>
                    ) : (
                        this.renderDetailsSection()
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}

export const AccountSummary = smartConnect<IExternalProps>(AccountSummaryComponent, [
    withTheme(stylesProvider)
]);
