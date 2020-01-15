import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IAccountState, ITransactionState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { getCurrentAccount, getCurrentAccountTransactions } from '../../redux/wallets/selectors';
import { TransactionsHistoryList } from './list-transactions-history/list-transactions-history';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';

export const navigationOptions = () => ({
    title: translate('DashboardMenu.transactionHistory')
});

export interface IReduxProps {
    selectedAccount: IAccountState;
    transactions: ITransactionState[];
}

const mapStateToProps = (state: IReduxState) => {
    return {
        selectedAccount: getCurrentAccount(state),
        transactions: getCurrentAccountTransactions(state)
    };
};

export class TransactionsHistoryScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & INavigationProps
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <TransactionsHistoryList
                    transactions={this.props.transactions}
                    account={this.props.selectedAccount}
                    navigation={this.props.navigation}
                />
            </View>
        );
    }
}

export const TransactionsHistoryScreen = smartConnect(TransactionsHistoryScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
