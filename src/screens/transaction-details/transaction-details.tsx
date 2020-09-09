import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from '../../components/icon/icon';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState } from '../../redux/wallets/state';
import { formatAddress } from '../../core/utils/format-address';
import {
    Blockchain,
    IBlockchainTransaction,
    ChainIdType,
    TransactionType
} from '../../core/blockchain/types';
import { getAccount } from '../../redux/wallets/selectors';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { Amount } from '../../components/amount/amount';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import moment from 'moment';
import { getChainId } from '../../redux/preferences/selectors';
import { normalize } from '../../styles/dimensions';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { openURL } from '../../core/utils/linking-handler';
import { IconValues } from '../../components/icon/values';
import { TokenType } from '../../core/blockchain/types/token';
import { Capitalize } from '../../core/utils/format-string';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
}

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    transaction: IBlockchainTransaction;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('Transaction.transactionDetails')
});

export class TransactionDetailsComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>> &
        IReduxProps
> {
    public static navigationOptions = navigationOptions;

    public goToExplorer() {
        const url = getBlockchain(this.props.account.blockchain)
            .networks.filter(n => n.chainId === this.props.chainId)[0]
            .explorer.getTransactionUrl(this.props.transaction.id);

        openURL(url);
    }

    public capitalizeString = (word: string) =>
        `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;

    public render() {
        const styles = this.props.styles;
        const transaction = this.props.transaction;
        const account = this.props.account;

        const date = new Date(transaction.date.signed);

        const blockchainInstance = getBlockchain(account.blockchain);
        const coin = blockchainInstance.config.coin;
        const amount = blockchainInstance.transaction.getTransactionAmount(transaction);

        const tokenConfig = getTokenConfig(account.blockchain, transaction?.token?.symbol);

        const recipient =
            transaction.token.type === TokenType.ZRC2 || transaction.token.type === TokenType.ERC20
                ? formatAddress(transaction.data.params[0], account.blockchain)
                : formatAddress(transaction.toAddress, account.blockchain);

        // TODO - refactor this :)
        const transactionType =
            transaction.additionalInfo && transaction.additionalInfo.posAction
                ? Capitalize(transaction.additionalInfo.posAction)
                : transaction.token.type === TokenType.ZRC2 ||
                  transaction.token.type === TokenType.ERC20 ||
                  transaction.type === TransactionType.CONTRACT_CALL
                ? Capitalize(transaction.data.method)
                : translate('App.labels.transfer');

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.rowContainer}>
                        <Text style={styles.textPrimary}>
                            {`${moment(date).format('L')}, ${moment(date).format('LTS')}`}
                        </Text>
                        <Text style={styles.textSecondary}>
                            {translate('App.labels.dateAndTime')}
                        </Text>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.textPrimary}>{transactionType}</Text>
                        <Text style={styles.textSecondary}>
                            {translate('Transaction.transactionType')}
                        </Text>
                    </View>

                    <View style={styles.rowContainer}>
                        <Amount
                            style={styles.textPrimary}
                            amount={amount}
                            blockchain={account.blockchain}
                            token={transaction?.token?.symbol || coin}
                            tokenDecimals={tokenConfig.decimals}
                        />
                        <Text style={styles.textSecondary}>{translate('Send.amount')}</Text>
                    </View>

                    {/* TODO: Fees */}
                    {/* <View style={styles.rowContainer}>
                        <Amount
                            style={styles.textPrimary}
                            amount={feeTotal}
                            blockchain={account.blockchain}
                            token={transaction?.token?.symbol || coin}
                            tokenDecimals={transaction?.token?.decimals || tokens[coin].decimals}
                        />
                        <Text style={styles.textSecondary}>{translate('App.labels.fee')}</Text>
                    </View> */}

                    <View style={styles.rowContainer}>
                        <Text style={styles.textPrimary}>
                            {translate(
                                `Transaction.statusValue.${this.capitalizeString(
                                    transaction.status.toString()
                                )}`
                            )}
                        </Text>
                        <Text style={styles.textSecondary}>
                            {translate('Transaction.transactionStatus')}
                        </Text>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.textPrimary}>
                            {formatAddress(transaction.address, account.blockchain)}
                        </Text>
                        <Text style={styles.textSecondary}>{translate('App.labels.sender')}</Text>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={styles.textPrimary}>{recipient}</Text>
                        <Text style={styles.textSecondary}>
                            {translate('App.labels.recipient')}
                        </Text>
                    </View>

                    <TouchableOpacity
                        testID={'transaction-id'}
                        style={styles.transactionIdContainer}
                        onPress={() => this.goToExplorer()}
                    >
                        <View style={styles.transactionId}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textPrimary}>
                                {transaction.id}
                            </Text>
                            <Text style={styles.textSecondary}>
                                {translate('Transaction.transactionID')}
                            </Text>
                        </View>
                        <Icon
                            name={IconValues.CHEVRON_RIGHT}
                            size={normalize(16)}
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    <View style={styles.rowContainer}>
                        <Text style={styles.textPrimary}>{transaction.nonce}</Text>
                        <Text style={styles.textSecondary}>{translate('Transaction.nonce')}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

export const TransactionDetails = smartConnect(TransactionDetailsComponent, [
    connect(mapStateToProps, undefined),
    withTheme(stylesProvider),
    withNavigationParams()
]);
