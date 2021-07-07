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
import { TransactionStatus } from '../../core/wallet/types';
import { updateTransactionFromBlockchain } from '../../redux/wallets/actions';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { HeaderLeft } from '../../components/header-left/header-left';
import { IconValues } from '../../components/icon/values';
import { NavigationService } from '../../navigation/navigation-service';

interface IReduxProps {
    selectedAccount: IAccountState;
    transactions: IBlockchainTransaction[];
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        selectedAccount: getSelectedAccount(state),
        transactions: getSelectedAccountTransactions(state)
    };
};

const mapDispatchToProps = {
    updateTransactionFromBlockchain
};

const navigationOptions = () => ({
    title: translate('DashboardMenu.transactionHistory'),
    headerLeft: (
        <HeaderLeft
            testID="go-back"
            icon={IconValues.ARROW_LEFT}
            onPress={() => NavigationService.popToTop()}
        />
    )
});

class TransactionsHistoryScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & INavigationProps
> {
    static navigationOptions = navigationOptions;

    public componentDidMount() {
        this.updateTransactions();
    }

    private updateTransactions() {
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
        return (
            <View style={this.props.styles.container}>
                <TestnetBadge />
                <TransactionsHistoryList
                    transactions={this.props.transactions}
                    account={this.props.selectedAccount}
                    navigation={this.props.navigation}
                    onRefresh={() => this.updateTransactions()}
                />
            </View>
        );
    }
}

export const TransactionsHistoryScreen = smartConnect(TransactionsHistoryScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
