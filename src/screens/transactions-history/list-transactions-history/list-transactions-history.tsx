import React from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { Text } from '../../../library';
import { IAccountState } from '../../../redux/wallets/state';
import { ICON_SIZE } from '../../../styles/dimensions';
import { Amount } from '../../../components/amount/amount';
import { translate } from '../../../core/i18n';
import { formatAddress } from '../../../core/utils/format-address';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import moment from 'moment';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { IBlockchainTransaction, IAdditionalInfoType } from '../../../core/blockchain/types';

export interface IExternalProps {
    transactions: IBlockchainTransaction[];
    account: IAccountState;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export class TransactionsHistoryListComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public getTransactionPrimaryText(
        tx: IBlockchainTransaction<IAdditionalInfoType>,
        account: IAccountState
    ) {
        const formattedAmount =
            tx.address === account.address
                ? translate('App.labels.to').toLowerCase()
                : translate('App.labels.from').toLowerCase();
        return ` ${formattedAmount} ${formatAddress(tx.toAddress)}`;
    }

    public render() {
        const styles = this.props.styles;
        const { transactions, account } = this.props;

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
                    <ScrollView style={{ flex: 1, alignSelf: 'stretch' }}>
                        {transactions.map(tx => {
                            const date = new Date(tx.date.signed);

                            return (
                                <TouchableOpacity
                                    key={tx.id}
                                    style={styles.transactionListItem}
                                    onPress={() => {
                                        this.props.navigation.navigate('TransactionDetails', {
                                            transaction: tx,
                                            accountIndex: account.index,
                                            blockchain: account.blockchain
                                        });
                                    }}
                                >
                                    <Icon
                                        name="money-wallet-1"
                                        size={ICON_SIZE}
                                        style={styles.transactionIcon}
                                    />
                                    <View style={styles.transactionTextContainer}>
                                        <View style={styles.transactionAmountContainer}>
                                            <Amount
                                                amount={tx.amount}
                                                blockchain={account.blockchain}
                                                token={
                                                    getBlockchain(account.blockchain).config.coin
                                                }
                                                tokenDecimals={
                                                    getBlockchain(account.blockchain).config.tokens[
                                                        getBlockchain(account.blockchain).config
                                                            .coin
                                                    ].decimals
                                                }
                                            />

                                            <Text style={styles.transactionTextPrimary}>
                                                {this.getTransactionPrimaryText(tx, account)}
                                            </Text>
                                        </View>
                                        <Text style={styles.transactionTextSecondary}>
                                            {`${moment(date).format('L')}, ${moment(date).format(
                                                'LTS'
                                            )}`}
                                        </Text>
                                    </View>
                                    <Icon
                                        name="chevron-right"
                                        size={16}
                                        style={styles.transactionRightIcon}
                                    />
                                </TouchableOpacity>
                            );
                        })}
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
