import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Icon } from '../../components/icon';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain, BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { ITransactionState, IAccountState } from '../../redux/wallets/state';
import { formatAddress } from '../../core/utils/format-address';
import { Blockchain } from '../../core/blockchain/types';
import { getAccount } from '../../redux/wallets/selectors';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { formatAmountFromAccount } from '../../core/utils/format-amount';

export interface IReduxProps {
    account: IAccountState;
}

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    transaction: ITransactionState;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('App.labels.details')
});

export class TransactionDetailsComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>> &
        IReduxProps
> {
    public static navigationOptions = navigationOptions;

    public goToExplorer = () => {
        const url = getBlockchain(this.props.account.blockchain).networks[0].explorer.getAccountUrl(
            this.props.transaction.fromAddress
        );
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };

    public render() {
        const styles = this.props.styles;
        const transaction = this.props.transaction;
        const account = this.props.account;
        const amount =
            BLOCKCHAIN_INFO[account.blockchain].coin + ' ' + formatAmountFromAccount(account);
        const date = new Date(transaction.date.signed);
        return (
            <ScrollView style={styles.container}>
                <TouchableOpacity
                    testID={'transaction-id'}
                    style={styles.rowContainer}
                    onPress={this.goToExplorer}
                >
                    <View>
                        <Text style={styles.textPrimary}>{transaction.id.slice(0, 40)}</Text>
                        <Text style={styles.textSecondary}>
                            {translate('Transaction.transactionID')}
                        </Text>
                    </View>
                    <Icon name="arrow-right-1" size={16} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.rowContainer}>
                    <View>
                        <Text style={styles.textPrimary}>
                            {formatAddress(transaction.fromAddress)}
                        </Text>
                        <Text style={styles.textSecondary}>{translate('App.labels.from')}</Text>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View>
                        <Text style={styles.textPrimary}>
                            {formatAddress(transaction.toAddress)}
                        </Text>
                        <Text style={styles.textSecondary}>{translate('App.labels.to')}</Text>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View>
                        <Text style={styles.textPrimary}>{date.toISOString()}</Text>
                        <Text style={styles.textSecondary}>{translate('App.labels.date')}</Text>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View>
                        <Text style={styles.textPrimary}>{amount}</Text>
                        <Text style={styles.textSecondary}>{translate('Send.amount')}</Text>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View>
                        <Text style={styles.textPrimary}>{transaction.nonce}</Text>
                        <Text style={styles.textSecondary}>{translate('Transaction.nonce')}</Text>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View>
                        <Text style={styles.textPrimary}>
                            {translate('Transaction.statusValue.' + transaction.status.toString())}
                        </Text>
                        <Text style={styles.textSecondary}>{translate('App.labels.status')}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain)
    };
};

export const TransactionDetails = smartConnect(TransactionDetailsComponent, [
    connect(mapStateToProps, {}),
    withTheme(stylesProvider),
    withNavigationParams()
]);
