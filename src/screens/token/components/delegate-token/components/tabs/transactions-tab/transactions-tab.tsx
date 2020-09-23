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
import { TransactionStatus } from '../../../../../../../core/wallet/types';
import { updateTransactionFromBlockchain } from '../../../../../../../redux/wallets/actions';

interface IExternalProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    navigation: NavigationScreenProp<NavigationState>;
}

interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
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

const mapDispatchToProps = {
    updateTransactionFromBlockchain
};

export class TransactionsTabComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & INavigationProps
> {
    private updateTransactionFromBlockchain() {
        this.props.transactions?.map((transaction: IBlockchainTransaction) => {
            if (transaction.status === TransactionStatus.PENDING) {
                this.props.updateTransactionFromBlockchain(
                    transaction.id,
                    transaction.blockchain,
                    transaction.chainId,
                    transaction.broadcastedOnBlock
                );
            }
        });
    }

    public render() {
        const { styles, navigation, account, transactions } = this.props;

        return (
            <View style={styles.container}>
                <TransactionsHistoryList
                    transactions={transactions}
                    account={account}
                    navigation={navigation}
                    onRefresh={() => this.updateTransactionFromBlockchain()}
                />
            </View>
        );
    }
}

export const TransactionsTab = smartConnect<IExternalProps>(TransactionsTabComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
