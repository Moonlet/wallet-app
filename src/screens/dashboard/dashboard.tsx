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
import { getBalance, setSelectedAccount, setSelectedBlockchain } from '../../redux/wallets/actions';
import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import {
    getSelectedWallet,
    getSelectedAccount,
    getSelectedBlockchain
} from '../../redux/wallets/selectors';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { Icon } from '../../components/icon';
import { themes } from '../../navigation/navigation';
import { ICON_SIZE, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { WalletConnectWeb } from '../../core/wallet-connect/wallet-connect-web';
import { IBlockchainsOptions } from '../../redux/preferences/state';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { BottomSheetType } from '../../redux/ui/bottomSheet/state';
import { calculateBalance } from '../../core/utils/balance';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';

export interface IReduxProps {
    wallet: IWalletState;
    walletsNr: number;
    getBalance: typeof getBalance;
    blockchains: IBlockchainsOptions;
    openBottomSheet: typeof openBottomSheet;
    selectedAccount: IAccountState;
    selectedBlockchain: Blockchain;
    exchangeRates: any;
    setSelectedAccount: typeof setSelectedAccount;
    setSelectedBlockchain: typeof setSelectedBlockchain;
}

interface IState {
    coins: Array<{ blockchain: Blockchain; order: number }>;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const mapStateToProps = (state: IReduxState) => ({
    wallet: getSelectedWallet(state),
    walletsNr: Object.keys(state.wallets).length,
    blockchains: state.preferences.blockchains,
    selectedBlockchain: getSelectedBlockchain(state),
    selectedAccount: getSelectedAccount(state),
    exchangeRates: (state as any).market.exchangeRates
});

const mapDispatchToProps = {
    getBalance,
    openBottomSheet,
    setSelectedAccount,
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

    public dashboardOpacity = new Animated.Value(1);
    public balancesScrollView: any;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            coins: this.buildCoins()
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

    public buildCoins() {
        const coins = [];
        Object.keys(this.props.blockchains).map(key => {
            const value = this.props.blockchains[key];
            // let blockchainHasAccounts = false;
            if (this.props.wallet) {
                if (key === Blockchain.NEAR) {
                    if (isFeatureActive(RemoteFeature.NEAR) === true) {
                        coins.push({
                            blockchain: key,
                            order: value.order
                        });
                    }
                } else {
                    coins.push({
                        blockchain: key,
                        order: value.order
                    });
                }
            }
        });

        return coins;
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (
            this.props.selectedAccount !== prevProps.selectedAccount &&
            this.props.selectedAccount
        ) {
            this.props.setSelectedBlockchain(this.props.selectedAccount.blockchain);
            this.props.getBalance(
                this.props.selectedAccount.blockchain,
                this.props.selectedAccount.address,
                undefined,
                true
            );
            this.setState({ coins: this.buildCoins() });
        }
    }

    public async componentDidMount() {
        if (this.props.selectedAccount) {
            this.props.getBalance(
                this.props.selectedAccount.blockchain,
                this.props.selectedAccount.address,
                undefined,
                true
            );
        }

        this.props.navigation.setParams({
            setDashboardMenuBottomSheet: this.setDashboardMenuBottomSheet
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
                                    this.props.setSelectedAccount({
                                        index: 0, // TODO - in the case we are not using the index 0 account this might not work
                                        blockchain: coin.blockchain
                                    });
                                    this.setState({ coins: this.buildCoins() });
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
        return (
            <View style={styles.container}>
                {coins.length !== 0 && (
                    <View style={styles.dashboardContainer}>
                        <View style={styles.coinBalanceCard}>
                            {this.props.selectedAccount && (
                                <CoinBalanceCard
                                    key={this.props.selectedAccount.address}
                                    onPress={() =>
                                        this.props.openBottomSheet(BottomSheetType.ACCOUNTS, {
                                            blockchain
                                        })
                                    }
                                    balance={calculateBalance(
                                        this.props.selectedAccount,
                                        this.props.exchangeRates
                                    )}
                                    blockchain={blockchain}
                                    currency={BLOCKCHAIN_INFO[blockchain].coin}
                                    toCurrency="USD"
                                    active={true}
                                    selectedAccount={this.props.selectedAccount}
                                />
                            )}
                        </View>

                        <Animated.View
                            style={[styles.coinDashboard, { opacity: this.dashboardOpacity }]}
                        >
                            <CoinDashboard
                                account={this.props.selectedAccount}
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
