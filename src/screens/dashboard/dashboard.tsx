import React from 'react';
import { View, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Text } from '../../library';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { CoinBalanceCard } from '../../components/coin-balance-card/coin-balance-card';
import { CoinDashboard } from '../../components/coin-dashboard/coin-dashboard';
import { IReduxState } from '../../redux/state';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { ITheme } from '../../core/theme/itheme';
import LinearGradient from 'react-native-linear-gradient';

import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { withTheme } from '../../core/theme/with-theme';
import { HeaderLeft } from '../../components/header-left/header-left';
import { HeaderRight } from '../../components/header-right/header-right';
import { getBalance } from '../../redux/wallets/actions';
import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { BigNumber } from 'bignumber.js';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    wallet: IWalletState;
    currentWalletIndex: number;

    getBalance: typeof getBalance;
}

interface IState {
    coinIndex: number;
    balance: any;
    coins: Blockchain[];
}

const FADE_ANIMATION_DURATION = 50;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCROLL_CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.5);
const ANIMATED_BC_SELECTION = true;

const calculateBalances = (accounts: IAccountState[]) =>
    accounts.reduce(
        (out: any, account: IAccountState) => {
            if (!out.balance[account.blockchain]) {
                out.balance[account.blockchain] = {
                    amount: account?.balance?.value || new BigNumber(0)
                };
                out.coins.push(account.blockchain);
            } else {
                out.balance[account.blockchain].amount = out.balance[
                    account.blockchain
                ].amount.plus(account?.balance?.value || new BigNumber(0));
            }
            return out;
        },
        { coins: [], balance: {} }
    );

const mapStateToProps = (state: IReduxState) => ({
    wallet: state.wallets[state.app.currentWalletIndex],
    currentWalletIndex: state.app.currentWalletIndex
});

const mapDispatchToProps = {
    getBalance
};

const MyTitle = ({ text }) => <Text style={{ fontSize: 17, fontWeight: 'bold' }}> {text}</Text>;
const MyConnectedTitle = connect((state: IReduxState) => ({
    text: `Wallet ${state.app.currentWalletIndex + 1}`
}))(MyTitle);

const navigationOptions = ({ navigation }: any) => ({
    headerTitle: () => <MyConnectedTitle />,
    headerLeft: <HeaderLeft icon="saturn-icon" />,
    headerRight: (
        <HeaderRight
            icon="single-man-hierachy"
            onPress={() => {
                navigation.navigate('Wallets');
            }}
        />
    )
});

export class DashboardScreenComponent extends React.Component<IProps & IReduxProps, IState> {
    public static navigationOptions = navigationOptions;
    public initialIndex = 0;
    public dashboardOpacity = new Animated.Value(1);
    public balancesScrollView: any;

    constructor(props: IProps & IReduxProps) {
        super(props);

        this.state = {
            coinIndex: this.initialIndex,
            ...calculateBalances(props.wallet.accounts)
        };
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

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
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
                        {this.state.coins.map((coin, i) => (
                            <CoinBalanceCard
                                balance={this.state.balance[this.state.coins[i]].amount}
                                currency={BLOCKCHAIN_INFO[this.state.coins[i]].coin}
                                width={SCROLL_CARD_WIDTH}
                                key={i}
                                toCurrency="USD"
                                active={this.state.coinIndex === i}
                            />
                        ))}
                        <View style={{ width: (SCREEN_WIDTH - SCROLL_CARD_WIDTH) / 2 }} />
                    </ScrollView>
                </View>
                <Animated.View
                    style={{
                        opacity: this.dashboardOpacity,
                        alignSelf: 'stretch',
                        flex: 1
                    }}
                >
                    <CoinDashboard
                        accounts={this.props.wallet.accounts.filter(
                            account => account.blockchain === this.state.coins[this.state.coinIndex]
                        )}
                        blockchain={this.state.coins[this.state.coinIndex]}
                        navigation={this.props.navigation}
                    />
                </Animated.View>

                <LinearGradient
                    colors={this.props.theme.shadowGradient}
                    locations={[0, 0.5]}
                    style={styles.selectorGradientContainer}
                >
                    <View style={styles.blockchainSelectorContainer} testID="blockchainSelector">
                        {this.state.coins.map((coin, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.blockchainButton,
                                    this.state.coinIndex === i && styles.blockchainButtonActive
                                ]}
                                onPress={() => this.setActiveCoin(i)}
                            >
                                <Text
                                    style={
                                        this.state.coinIndex === i &&
                                        styles.blockchainButtonTextActive
                                    }
                                >
                                    {BLOCKCHAIN_INFO[this.state.coins[i]].coin}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </LinearGradient>
            </View>
        );
    }
}

export const DashboardScreen = smartConnect(DashboardScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
