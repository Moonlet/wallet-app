import React from 'react';
import { View, ScrollView, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../../library';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { CoinBalanceCard } from '../../components/coin-balance-card/coin-balance-card';
import { TokenDashboard } from '../../components/token-dashboard/token-dashboard';
import { AccountCreate } from '../../components/account-create/account-create';
import { IReduxState } from '../../redux/state';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
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
import { ICON_SIZE, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { WalletConnectWeb } from '../../core/wallet-connect/wallet-connect-web';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { BottomSheetType } from '../../redux/ui/bottomSheet/state';
import { calculateBalance } from '../../core/utils/balance';
import { getBlockchains } from '../../redux/preferences/selectors';
import { NavigationEvents } from 'react-navigation';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';

export interface IReduxProps {
    wallet: IWalletState;
    walletsNr: number;
    getBalance: typeof getBalance;
    blockchains: Blockchain[];
    openBottomSheet: typeof openBottomSheet;
    selectedAccount: IAccountState;
    selectedBlockchain: Blockchain;
    exchangeRates: any;
    setSelectedBlockchain: typeof setSelectedBlockchain;
    isCreateAccount: boolean;
    selectedBlockchainAccounts: IAccountState[];
    userCurrency: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const mapStateToProps = (state: IReduxState) => ({
    wallet: getSelectedWallet(state),
    walletsNr: Object.keys(state.wallets).length,
    blockchains: getBlockchains(state),
    selectedBlockchain: getSelectedBlockchain(state),
    selectedAccount: getSelectedAccount(state),
    exchangeRates: state.market.exchangeRates,
    isCreateAccount: state.ui.screens.dashboard.isCreateAccount,
    selectedBlockchainAccounts: getSelectedBlockchainAccounts(state),
    userCurrency: state.preferences.currency
});

const mapDispatchToProps = {
    getBalance,
    openBottomSheet,
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
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public dashboardOpacity = new Animated.Value(1);
    public balancesScrollView: any;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        if (Platform.OS === 'web') {
            if (!WalletConnectWeb.isConnected()) {
                props.navigation.navigate('OnboardingScreen');
            }
        } else {
            if (props.blockchains.length === 0 || props.walletsNr < 1) {
                // maybe check this in another screen?
                props.navigation.navigate('OnboardingScreen');
            }
        }
    }

    public async componentDidMount() {
        this.props.navigation.setParams({
            setDashboardMenuBottomSheet: this.setDashboardMenuBottomSheet
        });
    }

    public setDashboardMenuBottomSheet = () => {
        this.props.openBottomSheet(BottomSheetType.DASHBOARD_MENU);
    };

    public renderBottomBlockchainNav = () => {
        const styles = this.props.styles;
        const { blockchains } = this.props;

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
                        {blockchains.map(blockchain => (
                            <TouchableOpacity
                                key={blockchain}
                                style={[
                                    styles.blockchainButton,
                                    this.props.selectedBlockchain === blockchain &&
                                        styles.blockchainButtonActive,
                                    {
                                        width: blockchains.length > 4 ? SCREEN_WIDTH / 4 : null
                                    }
                                ]}
                                onPress={() => {
                                    this.props.setSelectedBlockchain(blockchain);
                                }}
                            >
                                <Text
                                    style={
                                        this.props.selectedBlockchain === blockchain &&
                                        styles.blockchainButtonTextActive
                                    }
                                >
                                    {getBlockchain(blockchain).config.coin}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient>
        );
    };

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

    public render() {
        const styles = this.props.styles;
        const { blockchains } = this.props;
        const blockchain: Blockchain = this.props.selectedBlockchain;
        const showCreateAccount =
            this.props.isCreateAccount || this.props.selectedBlockchainAccounts.length === 0;

        return (
            <View style={styles.container}>
                <TestnetBadge />
                <NavigationEvents onWillFocus={payload => this.onFocus()} />
                {showCreateAccount && (
                    <AccountCreate blockchain={blockchain} navigation={this.props.navigation} />
                )}
                {!showCreateAccount && (
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
                                    currency={getBlockchain(blockchain).config.coin}
                                    toCurrency={this.props.userCurrency}
                                    active={true}
                                    selectedAccount={this.props.selectedAccount}
                                />
                            )}
                        </View>

                        {this.props.selectedAccount && (
                            <Animated.View
                                style={[styles.coinDashboard, { opacity: this.dashboardOpacity }]}
                            >
                                <TokenDashboard
                                    account={this.props.selectedAccount}
                                    blockchain={blockchain}
                                    navigation={this.props.navigation}
                                    showBottomPadding={blockchains.length > 1}
                                />
                            </Animated.View>
                        )}
                    </View>
                )}

                {blockchains.length > 1 && this.renderBottomBlockchainNav()}
            </View>
        );
    }
}

export const DashboardScreen = smartConnect(DashboardScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
