import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import {
    NavigationScreenProp,
    NavigationState,
    NavigationParams,
    NavigationEvents
} from 'react-navigation';
import { TokenCard } from '../token-card/token-card';
import { normalize } from '../../styles/dimensions';
import { Text } from '../../library';
import Icon from '../icon/icon';
import { IconValues } from '../icon/values';
import { translate } from '../../core/i18n';
import { BottomSheetType } from '../../redux/ui/bottomSheet/state';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { NavigationService } from '../../navigation/navigation-service';
import { QuickDelegateBanner } from '../quick-delegate-banner/quick-delegate-banner';
import { AccountSummary } from '../account-summary/account-summary';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { AffiliateBanner } from '../affiliate-banner/affiliate-banner';
import { AffiliateBannerType } from '../affiliate-banner/types';
import { IReduxState } from '../../redux/state';
import { AccountStats } from '../../core/blockchain/types/stats';
import { fetchAccountDelegateStats } from '../../redux/ui/stats/actions';
import { getAccountStats } from '../../redux/ui/stats/selectors';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';

interface IExternalProps {
    blockchain: Blockchain;
    account: IAccountState;
    showBottomPadding: boolean;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    chainId: ChainIdType;
}

interface IReduxProps {
    accountStats: AccountStats;
    openBottomSheet: typeof openBottomSheet;
    fetchAccountDelegateStats: typeof fetchAccountDelegateStats;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        accountStats:
            ownProps.account &&
            getAccountStats(state, ownProps.blockchain, ownProps.chainId, ownProps.account.address)
    };
};

const mapDispatchToProps = {
    openBottomSheet,
    fetchAccountDelegateStats
};

interface IState {
    token: ITokenState;
    loadingAccountStats: boolean;
}

export class TokenDashboardComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            token: undefined,
            loadingAccountStats: props.accountStats === undefined
        };
    }

    public componentDidMount() {
        this.fetchAccountStats();
    }

    public componentDidUpdate(prevProps: IExternalProps & IReduxProps) {
        if (
            this.props.blockchain !== prevProps.blockchain ||
            this.props.account !== prevProps.account
        ) {
            this.fetchAccountStats();
        }

        if (this.props.accountStats && this.props.accountStats !== prevProps.accountStats) {
            this.setState({
                loadingAccountStats: false
            });
        }
    }

    private fetchAccountStats() {
        const { account, blockchain, chainId } = this.props;

        if (!account) {
            return;
        }

        if (!this.props.accountStats) {
            this.setState({ loadingAccountStats: true });
        }

        const token: ITokenState = account.tokens[chainId][getBlockchain(blockchain).config.coin];
        this.setState({ token });
        this.props.fetchAccountDelegateStats(this.props.account, token);
    }

    private renderCard(options: { title?: string; icon: IconValues; onPress: () => void }) {
        const { styles, theme } = this.props;

        return (
            <TouchableHighlight
                onPress={() => options.onPress()}
                underlayColor={theme.colors.appBackground}
            >
                <View style={styles.cardContainer}>
                    <Icon name={options.icon} size={normalize(16)} style={styles.icon} />
                    {options.title && (
                        <Text style={styles.cardText} numberOfLines={1}>
                            {options.title}
                        </Text>
                    )}
                </View>
            </TouchableHighlight>
        );
    }

    public render() {
        const { styles } = this.props;

        let displayStakingFeatures = true;
        if (this.props.blockchain === Blockchain.ZILLIQA && !isFeatureActive(RemoteFeature.ZIL)) {
            displayStakingFeatures = false;
        }

        return (
            <View style={styles.container}>
                <View style={styles.cardWrapper}>
                    {this.renderCard({
                        title: translate('Account.switchAccounts'), // manageAccounts
                        icon: IconValues.ACTION_UP_DOWN, // IconValues.PENCIL,
                        onPress: () => NavigationService.navigate('ManageAccounts', {})
                    })}

                    {this.renderCard({
                        title: translate('DashboardMenu.transactionHistory'),
                        icon: IconValues.ARCHIVE_LOCKER,
                        onPress: () => NavigationService.navigate('TransactonsHistory', {})
                    })}

                    {this.renderCard({
                        icon: IconValues.NAVIGATION_MENU_HORIZONTAL,
                        onPress: () => this.props.openBottomSheet(BottomSheetType.DASHBOARD_MENU)
                    })}
                </View>

                <View
                    style={[
                        styles.tokensContainer,
                        { paddingBottom: this.props.showBottomPadding ? normalize(70) : 0 }
                    ]}
                >
                    <AffiliateBanner
                        type={AffiliateBannerType.LEDGER_NANO_X}
                        style={styles.affiliateBanner}
                    />

                    {displayStakingFeatures && (
                        <AccountSummary
                            isLoading={this.state.loadingAccountStats}
                            style={styles.accountSummary}
                            data={{
                                accountStats: this.props.accountStats,
                                blockchain: this.props.blockchain,
                                token: this.state.token,
                                extraToken: this.props.account?.tokens[this.props.chainId].gZIL
                            }}
                            enableExpand={true}
                        />
                    )}

                    {displayStakingFeatures && (
                        <QuickDelegateBanner
                            blockchain={this.props.blockchain}
                            account={this.props.account}
                            chainId={this.props.chainId}
                            style={styles.quickDelegateBannerContainer}
                            accountStats={this.props.accountStats}
                        />
                    )}

                    {this.props.account?.tokens &&
                        this.props.chainId &&
                        Object.values(this.props.account.tokens[this.props.chainId]).map(
                            (token: ITokenState, index: number) =>
                                token.active && (
                                    <TokenCard
                                        account={this.props.account}
                                        token={token}
                                        navigation={this.props.navigation}
                                        key={`token-${index}`}
                                        blockchain={this.props.blockchain}
                                        index={index}
                                    />
                                )
                        )}
                </View>

                <NavigationEvents onWillFocus={() => this.fetchAccountStats()} />
            </View>
        );
    }
}
export const TokenDashboard = smartConnect<IExternalProps>(TokenDashboardComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
