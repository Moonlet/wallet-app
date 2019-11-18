import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Icon } from '../../components/icon';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { HeaderLeft } from '../../components/header-left/header-left';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain, BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { ITransactionState, IAccountState } from '../../redux/wallets/state';
import { formatAddress } from '../../core/utils/format-address';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    account: IAccountState;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: state.wallets[state.app.currentWalletIndex].accounts[ownProps.accountIndex]
    };
};

export interface INavigationParams {
    accountIndex: number;
    transaction: ITransactionState;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack();
                }}
            />
        );
    },
    title: 'Details'
});
export class TransactionDetailsComponent extends React.Component<
    INavigationProps<INavigationParams> & IProps & IReduxProps
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
            BLOCKCHAIN_INFO[account.blockchain].coin +
            ' ' +
            transaction.amount.toString().slice(0, 5);
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
                        <Text style={styles.textSecondary}>{translate('Transaction.from')}</Text>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View>
                        <Text style={styles.textPrimary}>
                            {formatAddress(transaction.toAddress)}
                        </Text>
                        <Text style={styles.textSecondary}>{translate('Transaction.to')}</Text>
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
                        <Text style={styles.textPrimary}>{transaction.status.toString()}</Text>
                        <Text style={styles.textSecondary}>{translate('Transaction.status')}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export const TransactionDetails = smartConnect(TransactionDetailsComponent, [
    connect(mapStateToProps, {}),
    withTheme(stylesProvider),
    withNavigationParams()
]);
