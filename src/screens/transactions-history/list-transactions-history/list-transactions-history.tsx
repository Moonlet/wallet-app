import React from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { Text } from '../../../library';
import { IAccountState } from '../../../redux/wallets/state';
import { ICON_SIZE, normalize } from '../../../styles/dimensions';
import { Amount } from '../../../components/amount/amount';
import { translate } from '../../../core/i18n';
import { formatAddress } from '../../../core/utils/format-address';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import moment from 'moment';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { IBlockchainTransaction } from '../../../core/blockchain/types';
import { TransactionStatus } from '../../../core/wallet/types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { IconValues } from '../../../components/icon/values';

export interface IExternalProps {
    transactions: IBlockchainTransaction[];
    account: IAccountState;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export class TransactionsHistoryListComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public getTransactionPrimaryText(tx: IBlockchainTransaction, account: IAccountState) {
        const formattedAmount =
            tx.address === account.address
                ? translate('App.labels.to').toLowerCase()
                : translate('App.labels.from').toLowerCase();
        return ` ${formattedAmount} ${formatAddress(tx.toAddress, account.blockchain)}`;
    }

    private transactionItem(tx: IBlockchainTransaction) {
        const { account, styles, theme } = this.props;

        const blockchainInstance = getBlockchain(account.blockchain);
        const amount = blockchainInstance.transaction.getTransactionAmount(tx);

        const date = new Date(tx.date.signed);

        let txIcon: string;
        let txColor: string;

        switch (tx.status) {
            case TransactionStatus.PENDING:
                txIcon = IconValues.PENDING;
                txColor = theme.colors.warning;
                break;
            case TransactionStatus.SUCCESS:
                if (account.address.toLowerCase() === tx.address.toLowerCase()) {
                    txIcon = IconValues.OUTBOUND;
                    txColor = theme.colors.error;
                } else if (account.address.toLowerCase() === tx.toAddress.toLowerCase()) {
                    txIcon = IconValues.INBOUND;
                    txColor = theme.colors.positive;
                }
                break;
            case TransactionStatus.DROPPED:
                txIcon = IconValues.FAILED;
                txColor = theme.colors.disabledButton;
                break;
            default:
                txIcon = IconValues.FAILED;
                txColor = theme.colors.error;
                break;
        }

        const coin = blockchainInstance.config.coin;

        const txTokenConfig = getTokenConfig(tx.blockchain, tx?.token?.symbol);

        return (
            <TouchableOpacity
                key={tx.id}
                style={[
                    styles.transactionListItem,
                    tx.status === TransactionStatus.PENDING
                        ? styles.transactionListItemPending
                        : styles.transactionListItemOthers
                ]}
                onPress={() =>
                    this.props.navigation.navigate('TransactionDetails', {
                        transaction: tx,
                        accountIndex: account.index,
                        blockchain: account.blockchain
                    })
                }
            >
                <Icon
                    name={txIcon}
                    size={ICON_SIZE}
                    style={[styles.transactionIcon, { color: txColor }]}
                />
                <View style={styles.transactionTextContainer}>
                    <View style={styles.transactionAmountContainer}>
                        <Amount
                            amount={amount}
                            blockchain={account.blockchain}
                            token={txTokenConfig.symbol || coin}
                            tokenDecimals={txTokenConfig.decimals}
                        />

                        <Text style={styles.transactionTextPrimary}>
                            {this.getTransactionPrimaryText(tx, account)}
                        </Text>
                    </View>
                    <Text style={styles.transactionTextSecondary}>
                        {`${moment(date).format('L')}, ${moment(date).format('LTS')}`}
                    </Text>
                </View>
                <Icon
                    name={IconValues.CHEVRON_RIGHT}
                    size={normalize(16)}
                    style={styles.transactionRightIcon}
                />
            </TouchableOpacity>
        );
    }

    public render() {
        const { transactions, styles } = this.props;

        return (
            <View style={styles.transactionsContainer}>
                {typeof transactions === 'undefined' ||
                (transactions && transactions.length === 0) ? (
                    <View style={styles.emptySection}>
                        <Image
                            style={styles.logoImage}
                            source={require('../../../assets/images/png/moonlet_space_gray.png')}
                        />
                        <Text style={styles.noTransactionsText}>
                            {translate('Account.noTransactions')}
                        </Text>
                        <Text style={styles.transactionHistoryText}>
                            {translate('Account.transactionHistory')}
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {transactions.map((tx: IBlockchainTransaction) => this.transactionItem(tx))}
                    </ScrollView>
                )}
            </View>
        );
    }
}

export const TransactionsHistoryList = smartConnect<IExternalProps>(
    TransactionsHistoryListComponent,
    [withTheme(stylesProvider)]
);
