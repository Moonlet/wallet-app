import React from 'react';
import { View, Animated, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Text } from '../../library';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { TokenDashboard } from '../../components/token-dashboard/token-dashboard';
import { AccountCreate } from '../../components/account-create/account-create';
import { IReduxState } from '../../redux/state';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import LinearGradient from 'react-native-linear-gradient';

import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { getBalance, setSelectedBlockchain } from '../../redux/wallets/actions';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import {
    getSelectedWallet,
    getSelectedAccount,
    getSelectedBlockchain,
    getSelectedBlockchainAccounts
} from '../../redux/wallets/selectors';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { Icon } from '../../components/icon';
import { themes } from '../../navigation/navigation';
import {
    ICON_SIZE,
    ICON_CONTAINER_SIZE,
    BASE_DIMENSION,
    normalize,
    SCREEN_WIDTH
} from '../../styles/dimensions';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { BottomSheetType } from '../../redux/ui/bottomSheet/state';
import { calculateBalance } from '../../core/utils/balance';
import { getBlockchains, getChainId } from '../../redux/preferences/selectors';
import { NavigationEvents, StackActions } from 'react-navigation';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { IExchangeRates } from '../../redux/market/state';
import { formatAddress } from '../../core/utils/format-address';
import { Amount } from '../../components/amount/amount';
import { WalletType } from '../../core/wallet/types';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';

const ANIMATION_MAX_HEIGHT = normalize(160);
const ANIMATION_MIN_HEIGHT = normalize(70);

export interface IReduxProps {
    wallet: IWalletState;
    walletsNr: number;
    getBalance: typeof getBalance;
    blockchains: Blockchain[];
    openBottomSheet: typeof openBottomSheet;
    selectedAccount: IAccountState;
    selectedBlockchain: Blockchain;
    exchangeRates: IExchangeRates;
    setSelectedBlockchain: typeof setSelectedBlockchain;
    isCreateAccount: boolean;
    selectedBlockchainAccounts: IAccountState[];
    userCurrency: string;
    chainId: ChainIdType;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        wallet: getSelectedWallet(state),
        walletsNr: Object.keys(state.wallets).length,
        blockchains: getBlockchains(state),
        selectedBlockchain: getSelectedBlockchain(state),
        selectedAccount: getSelectedAccount(state),
        exchangeRates: state.market.exchangeRates,
        isCreateAccount: state.ui.screens.dashboard.isCreateAccount,
        selectedBlockchainAccounts: getSelectedBlockchainAccounts(state),
        userCurrency: state.preferences.currency,
        chainId: selectedAccount ? getChainId(state, selectedAccount.blockchain) : ''
    };
};

const mapDispatchToProps = {
    getBalance,
    openBottomSheet,
    setSelectedBlockchain
};

interface IState {
    extraSelectedBlockchain: Blockchain;
    isLoading: boolean;
}

const MyTitle = ({ text }) => (
    <Text
        style={{
            flex: 1,
            fontSize: normalize(20),
            lineHeight: normalize(25),
            letterSpacing: 0.38,
            textAlign: 'center'
        }}
    >
        {text}
    </Text>
);
const MyConnectedTitle = connect((state: IReduxState) => ({
    text: (getSelectedWallet(state) || {}).name
}))(MyTitle);

const navigationOptions = ({ navigation }: any) => ({
    headerTitle: () => <MyConnectedTitle />,
    headerLeft: <HeaderIcon />,
    headerRight: (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                style={{ width: ICON_CONTAINER_SIZE }}
                onPress={() => navigation.navigate('Wallets')}
            >
                <Icon
                    name="money-wallet-1"
                    size={ICON_SIZE}
                    style={{ color: themes.dark.colors.accent }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{ width: ICON_CONTAINER_SIZE }}
                onPress={() => navigation.state.params.setDashboardMenuBottomSheet()}
            >
                <Icon
                    name="navigation-menu-vertical"
                    size={ICON_SIZE}
                    style={{ color: themes.dark.colors.accent }}
                />
            </TouchableOpacity>
        </View>
    )
});

export class DashboardScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    private animationValue: any = new Animated.Value(0);

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            extraSelectedBlockchain: undefined,
            isLoading: false
        };
    }

    public async componentDidMount() {
        if (Platform.OS === 'web') {
            this.setState({ isLoading: true });
            if ((await ConnectExtensionWeb.isConnected()) === false) {
                this.setState({ isLoading: false });
                this.props.navigation.navigate('OnboardingNavigation');
            } else {
                this.setState({ isLoading: false });
                ConnectExtensionWeb.listenLastSync();
            }
        } else {
            if (this.props.blockchains.length === 0 || this.props.walletsNr < 1) {
                // maybe check this in another screen?
                this.props.navigation.dispatch(StackActions.popToTop());
                this.props.navigation.navigate('OnboardingNavigation');
            }
        }

        this.props.navigation.setParams({
            setDashboardMenuBottomSheet: this.setDashboardMenuBottomSheet
        });
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.selectedBlockchain !== prevProps.selectedBlockchain) {
            const blockchainNotFound =
                this.props.blockchains.slice(0, 4).indexOf(this.props.selectedBlockchain) === -1;

            if (blockchainNotFound) {
                this.setState({ extraSelectedBlockchain: this.props.selectedBlockchain });
            }
        }
    }

    public setDashboardMenuBottomSheet = () => {
        this.props.openBottomSheet(BottomSheetType.DASHBOARD_MENU);
    };

    private renderBlockchain(blockchain: Blockchain) {
        const { styles, blockchains } = this.props;

        return (
            <TouchableOpacity
                key={blockchain}
                style={[
                    styles.blockchainButton,
                    this.props.selectedBlockchain === blockchain && styles.blockchainButtonActive,
                    { width: blockchains.length > 4 ? SCREEN_WIDTH / 4 : 0 }
                ]}
                onPress={() => this.props.setSelectedBlockchain(blockchain)}
            >
                <Text
                    style={
                        this.props.selectedBlockchain === blockchain &&
                        styles.blockchainButtonTextActive
                    }
                >
                    {blockchain && getBlockchain(blockchain).config.ui.blockchainDisplay}
                </Text>
            </TouchableOpacity>
        );
    }

    public renderBottomBlockchainNav() {
        const { styles, blockchains } = this.props;
        const { extraSelectedBlockchain } = this.state;

        return (
            <LinearGradient
                colors={this.props.theme.shadowGradient}
                locations={[0, 0.5]}
                style={styles.selectorGradientContainer}
            >
                <View style={styles.blockchainSelectorContainer} testID="blockchainSelector">
                    <View style={styles.bottomBlockchainContainer}>
                        {blockchains
                            .slice(0, 4)
                            .map(blockchain => this.renderBlockchain(blockchain))}

                        {extraSelectedBlockchain !== undefined &&
                            this.renderBlockchain(extraSelectedBlockchain)}

                        {blockchains.length > 4 && (
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.openBottomSheet(
                                        BottomSheetType.BLOCKCHAIN_NAVIGATION
                                    )
                                }
                                style={styles.expandIconContainer}
                            >
                                <Icon
                                    name="expand"
                                    size={normalize(28)}
                                    style={styles.expandIcon}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </LinearGradient>
        );
    }

    public onFocus() {
        if (this.props.selectedAccount) {
            this.props.getBalance(
                this.props.selectedAccount.blockchain,
                this.props.selectedAccount.address,
                undefined,
                true
            );
        }
    }

    private renderCoinBalanceCard() {
        const { styles, selectedAccount, chainId } = this.props;
        const blockchain: Blockchain = this.props.selectedBlockchain;

        const balance =
            selectedAccount && calculateBalance(selectedAccount, chainId, this.props.exchangeRates);
        const config = blockchain && getBlockchain(blockchain).config;

        const animatePrimaryAmountFontSize = this.animationValue.interpolate({
            inputRange: [0, ANIMATION_MAX_HEIGHT, ANIMATION_MAX_HEIGHT + 1],
            outputRange: [normalize(30), normalize(19), normalize(19)],
            extrapolate: 'clamp'
        });

        const animateConvertedAmountFontSize = this.animationValue.interpolate({
            inputRange: [0, ANIMATION_MAX_HEIGHT, ANIMATION_MAX_HEIGHT + 1],
            outputRange: [normalize(16), normalize(13), normalize(13)],
            extrapolate: 'clamp'
        });

        const animateCoinBalanceCardHeight = this.animationValue.interpolate({
            inputRange: [0, ANIMATION_MAX_HEIGHT, ANIMATION_MAX_HEIGHT + 1],
            outputRange: [ANIMATION_MAX_HEIGHT, ANIMATION_MIN_HEIGHT, ANIMATION_MIN_HEIGHT],
            extrapolate: 'clamp'
        });

        const animateHideAccountAddress = this.animationValue.interpolate({
            inputRange: [0, ANIMATION_MAX_HEIGHT / 2, ANIMATION_MAX_HEIGHT],
            outputRange: Platform.select({
                default: [0, 0, 1],
                web: [1, 1, 0]
            }),
            extrapolate: 'clamp'
        });

        const animateOpacityAccountAddressWeb = this.animationValue.interpolate({
            inputRange: [0, ANIMATION_MIN_HEIGHT / 2, ANIMATION_MAX_HEIGHT],
            outputRange: [1, 0.5, 0],
            extrapolate: 'clamp'
        });

        const animateParimaryAmountVerticalPadding = this.animationValue.interpolate({
            inputRange: [0, ANIMATION_MAX_HEIGHT / 2, ANIMATION_MAX_HEIGHT],
            outputRange: [BASE_DIMENSION, BASE_DIMENSION / 2, 0],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View
                style={[styles.coinBalanceCard, { height: animateCoinBalanceCardHeight }]}
            >
                <TouchableOpacity
                    onPress={() =>
                        this.props.openBottomSheet(BottomSheetType.ACCOUNTS, { blockchain })
                    }
                >
                    {selectedAccount && (
                        <Animated.View
                            style={[
                                styles.row,
                                {
                                    flex: animateHideAccountAddress,
                                    opacity: Platform.select({
                                        default: 1,
                                        web: animateOpacityAccountAddressWeb
                                    })
                                }
                            ]}
                        >
                            <Text style={styles.account}>
                                {selectedAccount.name || `Account ${selectedAccount.index + 1}`}
                            </Text>
                            <Text style={styles.address}>
                                {formatAddress(selectedAccount.address, blockchain)}
                            </Text>
                        </Animated.View>
                    )}

                    <View style={styles.row}>
                        <Amount
                            style={[
                                styles.mainText,
                                {
                                    fontSize: animatePrimaryAmountFontSize,
                                    paddingVertical: animateParimaryAmountVerticalPadding
                                }
                            ]}
                            amount={String(balance)}
                            token={config.coin}
                            tokenDecimals={config.tokens[config.coin].decimals}
                            blockchain={blockchain}
                            isAnimated={true}
                        />
                        <Icon name="chevron-down" size={normalize(18)} style={styles.icon} />
                    </View>
                    <View style={styles.row}>
                        <Amount
                            style={[
                                styles.secondaryText,
                                { fontSize: animateConvertedAmountFontSize }
                            ]}
                            amount={String(balance)}
                            token={config.coin}
                            tokenDecimals={config.tokens[config.coin].decimals}
                            blockchain={blockchain}
                            convert
                            isAnimated={true}
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    private renderTokenDashboard() {
        const styles = this.props.styles;
        const { blockchains, chainId } = this.props;
        const blockchain: Blockchain = this.props.selectedBlockchain;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={[
                        styles.dashboardContainer,
                        {
                            paddingTop: ANIMATION_MAX_HEIGHT // TODO: animate this
                        }
                    ]}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([
                        { nativeEvent: { contentOffset: { y: this.animationValue } } }
                    ])}
                    alwaysBounceVertical={false}
                >
                    <TokenDashboard
                        account={this.props.selectedAccount}
                        blockchain={blockchain}
                        navigation={this.props.navigation}
                        showBottomPadding={blockchains?.length > 1}
                        chainId={chainId}
                    />
                </ScrollView>

                {this.renderCoinBalanceCard()}
            </View>
        );
    }

    public render() {
        const { blockchains, styles } = this.props;
        const blockchain: Blockchain = this.props.selectedBlockchain;
        const showCreateAccount =
            this.props.isCreateAccount && this.props.selectedBlockchainAccounts?.length === 0;

        /* Hardware wallets can have only one blockchain active */
        let renderBottomNav = false;
        const isHWWallet = this.props.wallet ? this.props.wallet.type === WalletType.HW : false;
        if (blockchains.length > 1 && !isHWWallet) renderBottomNav = true;

        if (Platform.OS === 'web' && this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <LoadingIndicator />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <NavigationEvents onWillFocus={payload => this.onFocus()} />

                {showCreateAccount && (
                    <AccountCreate blockchain={blockchain} navigation={this.props.navigation} />
                )}

                {!showCreateAccount && this.renderTokenDashboard()}

                {renderBottomNav && this.renderBottomBlockchainNav()}
            </View>
        );
    }
}

export const DashboardScreen = smartConnect(DashboardScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
