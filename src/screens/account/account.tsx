import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
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
import { Button } from '../../library';
import { translate, Translate } from '../../core/i18n';
import { AccountSettings } from './components/account-settings/account-settings';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { AccountAddress } from '../../components/account-address/account-address';
import { Blockchain } from '../../core/blockchain/types';
import { TransactionsHistoryList } from '../transactions-history/list-transactions-history/list-transactions-history';
import { formatNumber } from '../../core/utils/format-number';
import { BLOCKCHAIN_INFO, getBlockchain } from '../../core/blockchain/blockchain-factory';
import BigNumber from 'bignumber.js';
import { formatAddress } from '../../core/utils/format-address';
import { WalletConnectClient } from '../../core/wallet-connect/wallet-connect-client';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { sendTransferTransaction } from '../../redux/wallets/actions';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: ITransactionState[];
    wallet: IWalletState;
    sendTransferTransaction: typeof sendTransferTransaction;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        transactions: getAccountTransactions(state, ownProps.accountIndex, ownProps.blockchain),
        wallet: selectCurrentWallet(state),
        extensionTransactionPayload: ownProps.extensionTransactionPayload
    };
};

const mapDispatchToProps = {
    sendTransferTransaction
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    extensionTransactionPayload: any; // TODO add typing
}

interface IState {
    settingsVisible: boolean;
}

const navigationOptions = ({ navigation }: any) => ({
    headerRight: () => (
        <HeaderRight
            icon="navigation-menu-horizontal"
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
    public passwordModal: any;

    constructor(props: INavigationProps<INavigationParams> & IReduxProps & IProps) {
        super(props);

        this.state = {
            settingsVisible: false
        };

        if (this.props.extensionTransactionPayload) {
            // stub
            const {
                account,
                toAddress,
                amount,
                token,
                feeOptions
            } = this.props.extensionTransactionPayload.params[0];

            const formattedAmount = formatNumber(new BigNumber(amount), {
                currency: BLOCKCHAIN_INFO[account.blockchain].coin
            });

            Alert.alert(
                'Transaction.signTransaction',
                translate('Transaction.signExtensionTransaction', {
                    amount: formattedAmount,
                    fromAccount: formatAddress(account.address),
                    toAccount: formatAddress(toAddress)
                }),
                [
                    {
                        text: translate('App.labels.cancel'),
                        onPress: () => {
                            WalletConnectClient.getConnector().rejectRequest({
                                id: this.props.extensionTransactionPayload.id,
                                error: { message: 'Transaction refused' }
                            });
                        },
                        style: 'cancel'
                    },
                    {
                        text: translate('App.labels.sign'),
                        onPress: () => {
                            this.passwordModal
                                .requestPassword()
                                .then(password => {
                                    WalletConnectClient.getConnector().approveRequest({
                                        id: this.props.extensionTransactionPayload.id,
                                        result: {}
                                    });
                                    this.props.sendTransferTransaction(
                                        account,
                                        toAddress,
                                        amount,
                                        token,
                                        feeOptions,
                                        password,
                                        this.props.navigation
                                    );
                                })
                                .catch(() => {
                                    // maybe retry here
                                    WalletConnectClient.getConnector().rejectRequest({
                                        id: this.props.extensionTransactionPayload.id,
                                        error: { message: 'Wrong password' }
                                    });
                                });
                        }
                    }
                ]
            );
        }
    }
    public componentDidMount() {
        this.props.navigation.setParams({
            openSettingsMenu: this.openSettingsMenu
        });
    }

    public openSettingsMenu = () => this.setState({ settingsVisible: !this.state.settingsVisible });

    public render() {
        const { styles, navigation, account, transactions } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <AccountAddress account={account} />
                    <View style={styles.buttonsContainer}>
                        <Button
                            testID="button-send"
                            style={styles.button}
                            onPress={() => {
                                navigation.navigate('Send', {
                                    accountIndex: account.index,
                                    blockchain: account.blockchain,
                                    token: getBlockchain(account.blockchain).config.coin
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

                <PasswordModal obRef={ref => (this.passwordModal = ref)} />
            </View>
        );
    }
}

export const AccountScreen = smartConnect(AccountScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
