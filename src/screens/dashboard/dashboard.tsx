import React from 'react';
import { View, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Text } from '../../library';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { CoinBalanceCard } from '../../components/coin-balance-card/coin-balance-card';
import { CoinDashboard } from '../../components/coin-dashboard/coin-dashboard';
import { IReduxState } from '../../redux/state';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import LinearGradient from 'react-native-linear-gradient';

import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { HeaderLeft } from '../../components/header-left/header-left';
import { HeaderRight } from '../../components/header-right/header-right';
import { getBalance } from '../../redux/wallets/actions';
import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { BigNumber } from 'bignumber.js';
import { selectCurrentWallet } from '../../redux/wallets/selectors';
import { createSelector } from 'reselect';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { IBlockchainsOptions } from '../../redux/app/state';

export interface IReduxProps {
    wallet: IWalletState;
    walletsNr: number;
    getBalance: typeof getBalance;
    blockchains: IBlockchainsOptions;
}

interface IState {
    coinIndex: number;
    balance: any;
    coins: Array<{ blockchain: Blockchain; order: number }>;
}

const FADE_ANIMATION_DURATION = 50;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCROLL_CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.5);
const ANIMATED_BC_SELECTION = true;

const calculateBalances = (accounts: IAccountState[], blockchains: IBlockchainsOptions) => {
    const result = accounts.reduce(
        (out: any, account: IAccountState) => {
            if (!account) {
                return out;
            }
            if (!out.balance[account.blockchain]) {
                out.balance[account.blockchain] = {
                    amount: account?.balance?.value || new BigNumber(0)
                };
                if (blockchains[account.blockchain].active) {
                    out.coins.push({
                        blockchain: account.blockchain,
                        order: blockchains[account.blockchain].order
                    });
                }
            } else {
                out.balance[account.blockchain].amount = out.balance[
                    account.blockchain
                ].amount.plus(account?.balance?.value || new BigNumber(0));
            }
            return out;
        },
        { coins: [], balance: {} }
    );

    const coins = result.coins.sort((a, b) => a.order - b.order);
    const balance = result.balance;

    return { coins, balance };
};

const mapStateToProps = (state: IReduxState) => ({
    wallet: selectCurrentWallet(state),
    walletsNr: state.wallets.length,
    blockchains: state.app.blockchains
});

const mapDispatchToProps = {
    getBalance
};

const MyTitle = ({ text }) => (
    <Text
        style={{
            flex: 1,
            fontSize: 22,
            lineHeight: 28,
            opacity: 0.87,
            fontWeight: 'bold',
            // color: themes[theme].colors.text,
            textAlign: 'center'
        }}
    >
        {text}
    </Text>
);
const MyConnectedTitle = connect((state: IReduxState) => ({
    text: (selectCurrentWallet(state) || {}).name
}))(MyTitle);

const navigationOptions = ({ navigation, theme }: any) => ({
    headerTitle: () => <MyConnectedTitle />,
    headerLeft: <HeaderLeft icon="saturn-icon" />,
    headerRight: (
        <HeaderRight icon="single-man-hierachy" onPress={() => navigation.navigate('Wallets')} />
    )
});

// `calculateBalances` gets executed only when result of parameter picker function result is changed
const getWalletBalances = createSelector(
    [
        (wallet: IWalletState, blockchains: IBlockchainsOptions) => ({
            accounts: (wallet && wallet.accounts) || [],
            blockchains: blockchains || {}
        })
    ],
    result => calculateBalances(result.accounts, result.blockchains)
);

export class DashboardScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    public static getDerivedStateFromProps(props, state) {
        // update balances if wallet accounts changes
        return getWalletBalances(props.wallet, props.blockchains);
    }
    public passwordModal = null;
    public initialIndex = 0;
    public dashboardOpacity = new Animated.Value(1);
    public balancesScrollView: any;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            coinIndex: this.initialIndex,
            ...calculateBalances(props.wallet?.accounts || [], props.blockchains)
        };

        if (this.state.coins.length === 0 || props.walletsNr < 1) {
            // maybe check this in another screen?
            props.navigation.navigate('OnboardingScreen');
        }
    }

    public handleScrollEnd = (event: any) => {
        // calculate the index on which the animation stopped
        // (current scroll offset + left scrollview offset) / scroll card width
        // (event.nativeEvent.contentOffset.x + (SCREEN_WIDTH - SCROLL_CARD_WIDTH) / 2) /
        //         SCROLL_CARD_WIDTH
        const scrollIndex: number = Math.round(
            event.nativeEvent.contentOffset.x / SCROLL_CARD_WIDTH
        );

        // bail out if its the same coin index;
        if (scrollIndex === this.state.coinIndex) {
            return;
        }

        Animated.timing(this.dashboardOpacity, {
            toValue: 0,
            duration: FADE_ANIMATION_DURATION,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                coinIndex: scrollIndex
            });

            Animated.timing(this.dashboardOpacity, {
                toValue: 1,
                duration: FADE_ANIMATION_DURATION,
                useNativeDriver: true
            }).start();
        });
    };

    public setActiveCoin = (i: number) => {
        if (ANIMATED_BC_SELECTION) {
            this.setState({
                coinIndex: i
            });
        }

        if (this.balancesScrollView) {
            this.balancesScrollView.scrollTo({ x: SCROLL_CARD_WIDTH * i, ANIMATED_BC_SELECTION });
        }
    };

    public componentDidMount() {
        this.props.wallet?.accounts.map(account => {
            this.props.getBalance(account.blockchain, account.address, true);
        });
        this.passwordModal.requestPassword();
    }

    public renderBottomBlockchainNav = () => {
        const styles = this.props.styles;
        const { coins, coinIndex } = this.state;

        return (
            <LinearGradient
                colors={this.props.theme.shadowGradient}
                locations={[0, 0.5]}
                style={styles.selectorGradientContainer}
            >
                <View style={styles.blockchainSelectorContainer} testID="blockchainSelector">
                    <ScrollView
                        horizontal
                        disableIntervalMomentum={true}
                        overScrollMode={'never'}
                        centerContent={true}
                        snapToAlignment={'start'}
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsHorizontalScrollIndicator={false}
                        snapToStart={false}
                        snapToEnd={false}
                        decelerationRate={0.8}
                    >
                        {coins.map((coin, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.blockchainButton,
                                    coinIndex === i && styles.blockchainButtonActive,
                                    {
                                        width: coins.length > 3 ? SCREEN_WIDTH / 3 : null
                                    }
                                ]}
                                onPress={() => this.setActiveCoin(i)}
                            >
                                <Text style={coinIndex === i && styles.blockchainButtonTextActive}>
                                    {BLOCKCHAIN_INFO[coins[i].blockchain].coin}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient>
        );
    };

    public render() {
        const styles = this.props.styles;
        const { coins, coinIndex } = this.state;

        return (
            <View style={styles.container}>
                {coins.length !== 0 && (
                    <View>
                        <View style={styles.balancesContainer}>
                            <ScrollView
                                ref={ref => (this.balancesScrollView = ref)}
                                onMomentumScrollEnd={this.handleScrollEnd}
                                horizontal
                                disableIntervalMomentum={true}
                                overScrollMode={'never'}
                                centerContent={true}
                                snapToAlignment={'start'}
                                snapToInterval={SCROLL_CARD_WIDTH}
                                contentContainerStyle={{ marginTop: 16 }}
                                showsHorizontalScrollIndicator={false}
                                snapToStart={false}
                                snapToEnd={false}
                                decelerationRate={0.8}
                            >
                                <View style={{ width: (SCREEN_WIDTH - SCROLL_CARD_WIDTH) / 2 }} />
                                {coins.map((coin, i) => {
                                    const blockchain = coins[i].blockchain;
                                    return (
                                        <CoinBalanceCard
                                            balance={this.state.balance[blockchain].amount}
                                            blockchain={blockchain}
                                            currency={BLOCKCHAIN_INFO[blockchain].coin}
                                            width={SCROLL_CARD_WIDTH}
                                            key={i}
                                            toCurrency="USD"
                                            active={coinIndex === i}
                                        />
                                    );
                                })}
                                <View style={{ width: (SCREEN_WIDTH - SCROLL_CARD_WIDTH) / 2 }} />
                            </ScrollView>
                        </View>
                        <Animated.View
                            style={[styles.coinDashboard, { opacity: this.dashboardOpacity }]}
                        >
                            <CoinDashboard
                                accounts={(this.props.wallet?.accounts || []).filter(
                                    account =>
                                        account &&
                                        account.blockchain === coins[coinIndex].blockchain
                                )}
                                blockchain={coins[coinIndex].blockchain}
                                navigation={this.props.navigation}
                            />
                        </Animated.View>
                    </View>
                )}

                {coins.length > 1 && this.renderBottomBlockchainNav()}
                <PasswordModal obRef={ref => (this.passwordModal = ref)} />
            </View>
        );
    }
}

export const DashboardScreen = smartConnect(DashboardScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
