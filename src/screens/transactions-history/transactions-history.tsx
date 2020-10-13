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

export const navigationOptions = () => ({
    title: translate('DashboardMenu.transactionHistory'),
    headerLeft: (
        <HeaderLeft
            testID="go-back"
            icon={IconValues.ARROW_LEFT}
            onPress={() => NavigationService.popToTop()}
        />
    )
});

export interface IReduxProps {
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

export const TransactionsHistoryScreenComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & INavigationProps
) => {
    const updateTransactions = () => {
        props.transactions?.map((transaction: IBlockchainTransaction) => {
            if (transaction.status === TransactionStatus.PENDING) {
                props.updateTransactionFromBlockchain(
                    transaction.id,
                    transaction.blockchain,
                    transaction.chainId,
                    transaction.broadcastedOnBlock
                );
            }
        });
    };

    React.useEffect(() => updateTransactions(), []);

    return (
        <View style={props.styles.container}>
            <TestnetBadge />
            <TransactionsHistoryList
                transactions={props.transactions}
                account={props.selectedAccount}
                navigation={props.navigation}
                onRefresh={() => updateTransactions()}
            />
        </View>
    );
};

TransactionsHistoryScreenComponent.navigationOptions = navigationOptions;

export const TransactionsHistoryScreen = smartConnect(TransactionsHistoryScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
