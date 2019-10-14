import React from 'react';
import { View, ScrollView, Dimensions, Animated } from 'react-native';
import { Text } from '../../library/text';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import CoinBalanceCard from '../../components/coin-balance-card/coin-balance-card';
import CoinDashboard from '../../components/coin-dashboard/coin-dashboard';
import { mapStateToProps } from '../../redux/utils/redux-decorators';
import { IReduxState } from '../../redux/state';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { BLOCKCHAIN_COINS } from '../../core/constants';

import styles from './style.js';

interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    money: number;
    ethusd: number;
}

interface IReduxProps {
    wallet: IWalletState;
}

interface IState {
    coinIndex: number;
    balance: any;
    coins: Blockchain[];
}

const FADE_ANIMATION_DURATION = 100;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCROLL_CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.5);

const calculateBalances = (accounts: IAccountState[]) =>
    accounts.reduce(
        (out: any, account: IAccountState) => {
            if (!out.balance[account.blockchain]) {
                out.balance[account.blockchain] = {
                    amount: account.balance
                };
                out.coins.push(account.blockchain);
            } else {
                out.balance[account.blockchain].amount += account.balance;
            }
            return out;
        },
        { coins: [], balance: {} }
    );

@mapStateToProps(
    (state: IReduxState): IReduxProps => ({
        wallet: state.wallets[state.app.currentWalletIndex]
    })
)
export default class HomeScreen extends React.Component<IProps & IReduxProps, IState> {
    public initialIndex = 0;
    public dashboardOpacity = new Animated.Value(1);

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

    public render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>some header</Text>
                </View>
                <View style={styles.balancesContainer}>
                    <ScrollView
                        onMomentumScrollEnd={this.handleScrollEnd}
                        horizontal
                        disableIntervalMomentum={true}
                        overScrollMode={'never'}
                        centerContent={true}
                        // pagingEnabled
                        snapToAlignment={'start'}
                        snapToInterval={SCROLL_CARD_WIDTH}
                        contentContainerStyle={{ marginTop: 36 }}
                        showsHorizontalScrollIndicator={false}
                        snapToStart={false}
                        snapToEnd={false}
                        decelerationRate={'fast'}
                        // contentInset={{
                        //     left: (SCREEN_WIDTH - SCROLL_CARD_WIDTH) / 2,
                        //     right: (SCREEN_WIDTH - SCROLL_CARD_WIDTH) / 2,
                        //     top: 0,
                        //     bottom: 0
                        // }}
                        // contentOffset={{
                        //     x: this.initialIndex * SCROLL_CARD_WIDTH - SCROLL_CARD_WIDTH / 2,
                        //     y: 0
                        // }}
                    >
                        <View style={{ width: (SCREEN_WIDTH - SCROLL_CARD_WIDTH) / 2 }} />
                        {this.state.coins.map((coin, i) => (
                            <CoinBalanceCard
                                balance={this.state.balance[this.state.coins[i]].amount}
                                currency={BLOCKCHAIN_COINS[this.state.coins[i]]}
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
                    />
                </Animated.View>
            </View>
        );
    }
}
