import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
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
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { AffiliateBanner } from '../affiliate-banner/affiliate-banner';
import { AffiliateBannerType } from '../affiliate-banner/types';
import { AccountStats } from '../../redux/ui/stats/state';
import { fetchAccountDelegateStats } from '../../redux/ui/stats/actions';

interface IExternalProps {
    blockchain: Blockchain;
    account: IAccountState;
    showBottomPadding: boolean;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    chainId: ChainIdType;
}

interface IReduxProps {
    openBottomSheet: typeof openBottomSheet;
    fetchAccountDelegateStats: typeof fetchAccountDelegateStats;
}

const mapDispatchToProps = {
    openBottomSheet,
    fetchAccountDelegateStats
};

interface IState {
    accountStats: AccountStats;
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
            accountStats: undefined,
            token: undefined,
            loadingAccountStats: true
        };
    }

    public componentDidMount() {
        this.fetchAccountStats();
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (
            this.props.blockchain !== prevProps.blockchain ||
            this.props.account !== prevProps.account
        ) {
            this.fetchAccountStats();
        }
    }

    private fetchAccountStats() {
        const { account, blockchain, chainId } = this.props;

        if (!account) {
            return;
        }

        this.setState({ loadingAccountStats: true });

        const blockchainConfig = getBlockchain(blockchain);

        const token: ITokenState = account.tokens[chainId][blockchainConfig.config.coin];

        this.setState({ token });

        // update this section
        this.props.fetchAccountDelegateStats(this.props.account, token);

        blockchainConfig
            .getStats(chainId)
            .getAccountDelegateStats(account, token)
            .then(accStats =>
                this.setState({
                    accountStats: accStats,
                    loadingAccountStats: false
                })
            )
            .catch(e => SentryCaptureException(new Error(JSON.stringify(e))));
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

        return (
            <View style={styles.container}>
                <View style={styles.cardWrapper}>
                    {this.renderCard({
                        title: translate('Account.manageAccounts'),
                        icon: IconValues.PENCIL,
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

                    <AccountSummary
                        isLoading={this.state.loadingAccountStats}
                        style={styles.accountSummary}
                        data={{
                            accountStats: this.state.accountStats,
                            blockchain: this.props.blockchain,
                            token: this.state.token,
                            extraToken: this.props.account?.tokens[this.props.chainId].GZIL
                        }}
                        enableExpand={true}
                    />

                    <QuickDelegateBanner
                        blockchain={this.props.blockchain}
                        account={this.props.account}
                        chainId={this.props.chainId}
                        style={styles.quickDelegateBannerContainer}
                    />

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
            </View>
        );
    }
}
export const TokenDashboard = smartConnect<IExternalProps>(TokenDashboardComponent, [
    connect(null, mapDispatchToProps),
    withTheme(stylesProvider)
]);
