import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { HeaderRight } from '../../components/header-right/header-right';
import stylesProvider from './styles';
import { IAccountState, ITransactionState, IWalletState } from '../../redux/wallets/state';
import {
    getAccountTransactions,
    getAccount,
    selectCurrentWallet
} from '../../redux/wallets/selectors';
import { IReduxState } from '../../redux/state';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { withTheme } from '../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { Button, Text } from '../../library';
import { translate, Translate } from '../../core/i18n';
import { AccountSettings } from './components/account-settings/account-settings';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { AccountAddress } from '../../components/account-address/account-address';
import { Blockchain } from '../../core/blockchain/types';
import { TransactionsHistoryList } from '../transactions-history/list-transactions-history/list-transactions-history';
import { ICON_SIZE, BASE_DIMENSION } from '../../styles/dimensions';
import { themes } from '../../navigation/navigation';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: ITransactionState[];
    wallet: IWalletState;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        transactions: getAccountTransactions(state, ownProps.accountIndex, ownProps.blockchain),
        wallet: selectCurrentWallet(state)
    };
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
}

interface IState {
    settingsVisible: boolean;
}

const navigationOptions = ({ navigation, theme }: any) => ({
    headerRight: () => (
        <HeaderRight
            icon="navigation-menu-horizontal"
            onPress={navigation.state.params ? navigation.state.params.openSettingsMenu : undefined}
        />
    ),
    headerTitle: () => (
        <View style={{ flexDirection: 'row' }}>
            <Image
                style={{ height: ICON_SIZE, width: ICON_SIZE, marginRight: BASE_DIMENSION }}
                resizeMode="contain"
                source={navigation.state.params.token.logo} // TODO: fix here for ERC-20
            />
            <Text
                style={{
                    fontSize: 22,
                    lineHeight: 28,
                    color: themes[theme].colors.text,
                    letterSpacing: 0.38,
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
            >
                {`${translate('App.labels.account')} ${navigation.state.params.accountIndex + 1}`}
            </Text>
        </View>
    )
});

export class TokenScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IReduxProps & IProps,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: INavigationProps<INavigationParams> & IReduxProps & IProps) {
        super(props);

        this.state = {
            settingsVisible: false
        };
    }
    public componentDidMount() {
        this.props.navigation.setParams({
            openSettingsMenu: this.openSettingsMenu
        });
    }

    public openSettingsMenu = () => this.setState({ settingsVisible: !this.state.settingsVisible });

    public render() {
        const { styles, navigation, account, transactions } = this.props;
        const { token } = this.props.navigation.state.params;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <AccountAddress account={account} token={token} />
                    <View style={styles.buttonsContainer}>
                        <Button
                            testID="button-send"
                            style={styles.button}
                            onPress={() => {
                                navigation.navigate('Send', {
                                    accountIndex: account.index,
                                    blockchain: account.blockchain,
                                    token
                                });
                            }}
                        >
                            {translate('App.labels.send')}
                        </Button>
                        <Button
                            testID="button-receive"
                            style={styles.button}
                            onPress={() => {
                                navigation.navigate('Receive', {
                                    accountIndex: account.index,
                                    blockchain: account.blockchain,
                                    token
                                });
                            }}
                        >
                            {translate('App.labels.receive')}
                        </Button>
                    </View>

                    <View>
                        <Translate
                            text="App.labels.transactions"
                            style={styles.transactionsTitle}
                        />
                        <TransactionsHistoryList
                            transactions={transactions}
                            account={account}
                            navigation={navigation}
                        />
                    </View>

                    {this.state.settingsVisible && (
                        <AccountSettings
                            onDonePressed={this.openSettingsMenu}
                            account={this.props.account}
                            wallet={this.props.wallet}
                        />
                    )}
                </ScrollView>
            </View>
        );
    }
}

export const TokenScreen = smartConnect(TokenScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
