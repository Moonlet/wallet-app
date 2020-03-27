import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import stylesProvider from './styles';
import { IAccountState, IWalletState } from '../../../../redux/wallets/state';
import {
    getAccountFilteredTransactions,
    getAccount,
    getSelectedWallet
} from '../../../../redux/wallets/selectors';
import { IReduxState } from '../../../../redux/state';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Button } from '../../../../library';
import { translate, Translate } from '../../../../core/i18n';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { AccountAddress } from '../../../../components/account-address/account-address';
import { Blockchain, IBlockchainTransaction, ChainIdType } from '../../../../core/blockchain/types';
import { TransactionsHistoryList } from '../../../transactions-history/list-transactions-history/list-transactions-history';
import { formatNumber } from '../../../../core/utils/format-number';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import BigNumber from 'bignumber.js';
import { formatAddress } from '../../../../core/utils/format-address';
import { WalletConnectClient } from '../../../../core/wallet-connect/wallet-connect-client';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { sendTransferTransaction } from '../../../../redux/wallets/actions';
import { Dialog } from '../../../../components/dialog/dialog';
import { getChainId } from '../../../../redux/preferences/selectors';
import { ITokenConfig } from '../../../../core/blockchain/types/token';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    extensionTransactionPayload: any; // TODO add typing
    token: ITokenConfig;
    navigation: NavigationScreenProp<NavigationState>;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
    wallet: IWalletState;
    sendTransferTransaction: typeof sendTransferTransaction;
    chainId: ChainIdType;
    canSend: boolean;
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        transactions: getAccountFilteredTransactions(
            state,
            ownProps.accountIndex,
            ownProps.blockchain,
            ownProps.token
        ),
        wallet: getSelectedWallet(state),
        extensionTransactionPayload: ownProps.extensionTransactionPayload,
        chainId: getChainId(state, ownProps.blockchain),
        canSend: Platform.OS !== 'web' || state.ui.extension.stateLoaded
    };
};

const mapDispatchToProps = {
    sendTransferTransaction
};

export class DefaultTokenScreenComponent extends React.Component<
    INavigationProps & IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(
        props: INavigationProps &
            IProps &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

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
                currency: getBlockchain(account.blockchain).config.coin
            });

            Dialog.alert(
                'Transaction.signTransaction',
                translate('Transaction.signExtensionTransaction', {
                    amount: formattedAmount,
                    fromAccount: formatAddress(account.address, account.blockchain),
                    toAccount: formatAddress(toAddress, account.blockchain)
                }),

                {
                    text: translate('App.labels.cancel'),
                    onPress: () => {
                        this.props.navigation.navigate('Dashboard');
                        WalletConnectClient.getConnector().rejectRequest({
                            id: this.props.extensionTransactionPayload.id,
                            error: { message: 'Transaction refused' }
                        });
                    }
                },
                {
                    text: translate('App.labels.sign'),
                    onPress: () => {
                        PasswordModal.getPassword()
                            .then(password => {
                                WalletConnectClient.getConnector().approveRequest({
                                    id: this.props.extensionTransactionPayload.id,
                                    result: {}
                                });
                                this.props.sendTransferTransaction(
                                    account,
                                    toAddress,
                                    amount,
                                    token.symbol,
                                    feeOptions,
                                    password,
                                    this.props.navigation,
                                    {},
                                    false
                                );
                            })
                            .catch(() => {
                                // TODO

                                // maybe retry here
                                WalletConnectClient.getConnector().rejectRequest({
                                    id: this.props.extensionTransactionPayload.id,
                                    error: { message: 'Wrong password' }
                                });
                            });
                    }
                }
            );
        }
    }

    public render() {
        const { styles, navigation, account, transactions, token } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <AccountAddress account={account} token={token} />
                    <View style={styles.buttonsContainer}>
                        <Button
                            testID="button-send"
                            style={styles.button}
                            disabled={!this.props.canSend}
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
                </ScrollView>
            </View>
        );
    }
}

export const DefaultTokenScreen = smartConnect<IProps>(DefaultTokenScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
