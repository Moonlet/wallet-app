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
import { getBalance, selectAccount } from '../../redux/wallets/actions';
import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { BigNumber } from 'bignumber.js';
import { selectCurrentWallet } from '../../redux/wallets/selectors';
import { createSelector } from 'reselect';
import { IBlockchainsOptions, BottomSheetType } from '../../redux/app/state';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { Icon } from '../../components/icon';
import { themes } from '../../navigation/navigation';
import { ICON_SIZE, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { openBottomSheet } from '../../redux/app/actions';

export interface IReduxProps {
    wallet: IWalletState;
    walletsNr: number;
    getBalance: typeof getBalance;
    blockchains: IBlockchainsOptions;
    openBottomSheet: typeof openBottomSheet;
    selectAccount: typeof selectAccount;
}

interface IState {
    coinIndex: number;
    balance: any;
    coins: Array<{ blockchain: Blockchain; order: number }>;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

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
                if (blockchains && blockchains[account.blockchain]?.active) {
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
    getBalance,
    openBottomSheet,
    selectAccount
};

const MyTitle = ({ text }) => (
    <Text
        style={{
            flex: 1,
            fontSize: 20,
            lineHeight: 25,
            opacity: 0.87,
            letterSpacing: 0.38,
            textAlign: 'center'
        }}
    >
        {text}
    </Text>
);
const MyConnectedTitle = connect((state: IReduxState) => ({
    text: (selectCurrentWallet(state) || {}).name
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

    public componentDidMount() {
        this.props.wallet?.accounts.map(account => {
            this.props.getBalance(account.blockchain, account.address, true);
        });

        this.props.navigation.setParams({
            setDashboardMenuBottomSheet: this.setDashboardMenuBottomSheet
        });
    }

    public setDashboardMenuBottomSheet = () => {
        this.props.openBottomSheet(BottomSheetType.DASHBOARD_MENU);
    };

    public renderBottomBlockchainNav = () => {
        const styles = this.props.styles;
        const { coins, coinIndex } = this.state;
        const { wallet } = this.props;

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
                        {coins.map((coin: { blockchain: Blockchain; order: number }) => (
                            <TouchableOpacity
                                key={coin.order}
                                style={[
                                    styles.blockchainButton,
                                    coinIndex === coin.order && styles.blockchainButtonActive,
                                    {
                                        width: coins.length > 3 ? SCREEN_WIDTH / 3 : null
                                    }
                                ]}
                                onPress={() => {
                                    this.setState({ coinIndex: coin.order });

                                    this.props.selectAccount(
                                        wallet.id,
                                        coin.blockchain,
                                        wallet.accounts.filter(
                                            account => account.blockchain === coin.blockchain
                                        )[0]
                                    );
                                }}
                            >
                                <Text
                                    style={
                                        coinIndex === coin.order &&
                                        styles.blockchainButtonTextActive
                                    }
                                >
                                    {BLOCKCHAIN_INFO[coins[coin.order].blockchain].coin}
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
        const blockchain: Blockchain = coins[coinIndex]?.blockchain;

        return (
            <View style={styles.container}>
                {coins.length !== 0 && (
                    <View style={styles.dashboardContainer}>
                        <View style={styles.coinBalanceCard}>
                            <CoinBalanceCard
                                onPress={() =>
                                    this.props.openBottomSheet(BottomSheetType.ACCOUNTS, {
                                        blockchain
                                    })
                                }
                                balance={this.state.balance[blockchain].amount}
                                blockchain={blockchain}
                                currency={BLOCKCHAIN_INFO[blockchain].coin}
                                toCurrency="USD"
                                active={true}
                                selectedAccount={this.props.wallet.selectedAccount}
                            />
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
            </View>
        );
    }
}

export const DashboardScreen = smartConnect(DashboardScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
