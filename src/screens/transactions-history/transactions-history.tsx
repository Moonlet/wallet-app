import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IAccountState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { getSelectedAccount, getSelectedAccountTransactions } from '../../redux/wallets/selectors';
import { TransactionsHistoryList } from './list-transactions-history/list-transactions-history';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { IBlockchainTransaction } from '../../core/blockchain/types';

export const navigationOptions = () => ({
    title: translate('DashboardMenu.transactionHistory')
});

export interface IReduxProps {
    selectedAccount: IAccountState;
    transactions: IBlockchainTransaction[];
}

const mapStateToProps = (state: IReduxState) => {
    return {
        selectedAccount: getSelectedAccount(state),
        transactions: getSelectedAccountTransactions(state)
    };
};

export const TransactionsHistoryScreenComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & INavigationProps
) => {
    return (
        <View style={props.styles.container}>
            <TransactionsHistoryList
                transactions={props.transactions}
                account={props.selectedAccount}
                navigation={props.navigation}
            />
        </View>
    );
};

TransactionsHistoryScreenComponent.navigationOptions = navigationOptions;

export const TransactionsHistoryScreen = smartConnect(TransactionsHistoryScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
