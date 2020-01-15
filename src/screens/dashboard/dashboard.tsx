import React from 'react';
import { View, ScrollView, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
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
import { getBalance, switchSelectedAccount } from '../../redux/wallets/actions';
import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { BigNumber } from 'bignumber.js';
import { selectCurrentWallet, getCurrentAccount } from '../../redux/wallets/selectors';
import { createSelector } from 'reselect';
import { IBlockchainsOptions, BottomSheetType } from '../../redux/app/state';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { Icon } from '../../components/icon';
import { themes } from '../../navigation/navigation';
import { ICON_SIZE, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { openBottomSheet, setSelectedBlockchain } from '../../redux/app/actions';
import { WalletConnectWeb } from '../../core/wallet-connect/wallet-connect-web';
import { ph } from '../../styles/common';

export interface IReduxProps {
    wallet: IWalletState;
    walletsNr: number;
    getBalance: typeof getBalance;
    blockchains: IBlockchainsOptions;
    openBottomSheet: typeof openBottomSheet;
    currentAccount: IAccountState;
    selectedBlockchain: Blockchain;
    switchSelectedAccount: typeof switchSelectedAccount;
    setSelectedBlockchain: typeof setSelectedBlockchain;
}

interface IState {
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
    walletsNr: Object.keys(state.wallets).length,
    blockchains: state.app.blockchains,
    selectedBlockchain: state.app.selectedBlockchain,
    currentAccount: getCurrentAccount(state)
});

const mapDispatchToProps = {
    getBalance,
    openBottomSheet,
    switchSelectedAccount,
    setSelectedBlockchain
};

const MyTitle = ({ text }) => (
    <Text
        style={{
            flex: 1,
            fontSize: 20,
            lineHeight: 25,
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
        return getWalletBalances(props.wallet, props.blockchains);
    }
    public dashboardOpacity = new Animated.Value(1);
    public balancesScrollView: any;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            ...calculateBalances(props.wallet?.accounts || [], props.blockchains)
        };

        if (Platform.OS === 'web') {
            if (!WalletConnectWeb.isConnected()) {
                props.navigation.navigate('OnboardingScreen');
            }
            // else {
            //     WalletConnectWeb.getState().then(() => {
            //         this.getWalletBalances(this.props.wallet);
            //     });
            // }
        } else {
            if (this.state.coins.length === 0 || props.walletsNr < 1) {
                // maybe check this in another screen?
                props.navigation.navigate('OnboardingScreen');
            }
        }
    }

    public componentDidMount() {
        this.getWalletBalances(this.props.wallet);

        this.props.navigation.setParams({
            setDashboardMenuBottomSheet: this.setDashboardMenuBottomSheet
        });
    }

    public getWalletBalances(wallet: IWalletState) {
        // TODO: fix balance
        wallet?.accounts.map(account => {
            this.props.getBalance(account.blockchain, account.address, undefined, true);
        });
    }

    public setDashboardMenuBottomSheet = () => {
        this.props.openBottomSheet(BottomSheetType.DASHBOARD_MENU);
    };

    public renderBottomBlockchainNav = () => {
        const styles = this.props.styles;
        const { coins } = this.state;

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
                                    this.props.selectedBlockchain === coin.blockchain &&
                                        styles.blockchainButtonActive,
                                    {
                                        width: coins.length > 3 ? SCREEN_WIDTH / 3 : null
                                    }
                                ]}
                                onPress={() => {
                                    this.props.setSelectedBlockchain(coin.blockchain);
                                    this.props.switchSelectedAccount({
                                        index: 0, // TODO - in the case we are not using the index 0 account this might not work
                                        blockchain: coin.blockchain
                                    });
                                }}
                            >
                                <Text
                                    style={
                                        this.props.selectedBlockchain === coin.blockchain &&
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
        const { coins } = this.state;
        const blockchain: Blockchain = this.props.selectedBlockchain;
        const containerExtraStyle = Platform.select({
            default: undefined,
            web: { minHeight: ph(100) }
        });

        return (
            <View style={[styles.container, containerExtraStyle]}>
                {coins.length !== 0 && (
                    <View style={styles.dashboardContainer}>
                        <View style={styles.coinBalanceCard}>
                            {this.props.currentAccount && (
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
                                    selectedAccount={this.props.currentAccount}
                                />
                            )}
                        </View>

                        <Animated.View
                            style={[styles.coinDashboard, { opacity: this.dashboardOpacity }]}
                        >
                            <CoinDashboard
                                account={this.props.currentAccount}
                                blockchain={blockchain}
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
