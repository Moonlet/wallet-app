import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { TransactionsHistoryList } from '../../../../../../transactions-history/list-transactions-history/list-transactions-history';
import { connect } from 'react-redux';
import { IReduxState } from '../../../../../../../redux/state';
import { INavigationProps } from '../../../../../../../navigation/with-navigation-params';
import { Blockchain, IBlockchainTransaction } from '../../../../../../../core/blockchain/types';
import { ITokenState, IAccountState } from '../../../../../../../redux/wallets/state';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import {
    getAccount,
    getAccountFilteredTransactions
} from '../../../../../../../redux/wallets/selectors';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    navigation: NavigationScreenProp<NavigationState>;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        transactions: getAccountFilteredTransactions(
            state,
            ownProps.accountIndex,
            ownProps.blockchain,
            ownProps.token
        )
    };
};

export class TransactionsTabComponent extends React.Component<
    IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & INavigationProps
> {
    public render() {
        const { styles, navigation, account, transactions } = this.props;

        return (
            <View style={styles.container}>
                <TransactionsHistoryList
                    transactions={transactions}
                    account={account}
                    navigation={navigation}
                />
            </View>
        );
    }
}

export const TransactionsTab = smartConnect<IProps>(TransactionsTabComponent, [
    connect(mapStateToProps, undefined),
    withTheme(stylesProvider)
]);
