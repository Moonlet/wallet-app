import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
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
import { Text, Button } from '../../library';
import { translate, Translate } from '../../core/i18n';
import { Icon } from '../../components/icon';
import { AccountSettings } from './components/account-settings/account-settings';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { AccountAddress } from '../../components/account-address/account-address';
import { formatAddress } from '../../core/utils/format-address';
import { Blockchain } from '../../core/blockchain/types';
import { Amount } from '../../components/amount/amount';
import { ICON_SIZE } from '../../styles/dimensions';

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

const navigationOptions = ({ navigation }: any) => ({
    headerRight: () => (
        <HeaderRight
            icon="navigation-menu-vertical"
            onPress={navigation.state.params ? navigation.state.params.openSettingsMenu : undefined}
        />
    ),
    title: `${translate('App.labels.account')} ${navigation.state.params.accountIndex + 1}`
});

export class AccountScreenComponent extends React.Component<
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

    public openSettingsMenu = () => {
        this.setState({ settingsVisible: !this.state.settingsVisible });
    };

    public getTransactionPrimaryText(tx: ITransactionState, account: IAccountState) {
        const formattedAmount =
            tx.fromAddress === account.address
                ? translate('App.labels.to').toLowerCase()
                : translate('App.labels.from').toLowerCase();
        return formattedAmount + ' ' + formatAddress(tx.toAddress);
    }

    public render() {
        const { styles, navigation, account, transactions } = this.props;
        return (
            <ScrollView style={styles.container}>
                <AccountAddress account={account} />
                <View style={styles.buttonsContainer}>
                    <Button
                        testID="button-send"
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('Send', {
                                accountIndex: account.index,
                                blockchain: account.blockchain
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
                                blockchain: account.blockchain
                            });
                        }}
                    >
                        {translate('App.labels.receive')}
                    </Button>
                </View>

                {transactions && (
                    <View style={styles.transactionsContainer}>
                        <Translate
                            text="App.labels.transactions"
                            style={styles.transactionsTitle}
                        />
                        <View>
                            {transactions.map(tx => {
                                const date = new Date(tx.date.signed);

                                return (
                                    <TouchableOpacity
                                        key={tx.id}
                                        style={styles.transactionListItem}
                                        onPress={() => {
                                            navigation.navigate('TransactionDetails', {
                                                transaction: tx,
                                                accountIndex: account.index,
                                                blockchain: account.blockchain
                                            });
                                        }}
                                    >
                                        <Icon
                                            name="money-wallet-1"
                                            size={ICON_SIZE}
                                            style={styles.transactionIcon}
                                        />
                                        <View style={styles.transactionTextContainer}>
                                            <View style={styles.transactionAmountContainer}>
                                                <Amount
                                                    amount={tx.amount}
                                                    blockchain={account.blockchain}
                                                />

                                                <Text style={styles.transactionTextPrimary}>
                                                    {this.getTransactionPrimaryText(tx, account)}
                                                </Text>
                                            </View>
                                            <Text style={styles.transactionTextSecondary}>
                                                {date.toISOString()}
                                            </Text>
                                        </View>
                                        <Icon
                                            name="arrow-right-1"
                                            size={16}
                                            style={styles.transactionRightIcon}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {this.state.settingsVisible && (
                    <AccountSettings
                        onDonePressed={this.openSettingsMenu}
                        account={this.props.account}
                        wallet={this.props.wallet}
                    />
                )}
            </ScrollView>
        );
    }
}

export const AccountScreen = smartConnect(AccountScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
