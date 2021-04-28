import React from 'react';
import { View, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
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
    TransactionType,
    IFeeOptions
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
import { TransactionStatus } from '../../core/wallet/types';
import { Client as ZilliqaClient } from '../../core/blockchain/zilliqa/client';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../core/utils/format-number';
import { Dialog } from '../../components/dialog/dialog';
import { captureException as SentryCaptureException } from '@sentry/react-native';

interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
}

interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    transaction: IBlockchainTransaction;
}

interface IState {
    zilRewards: {
        gZil: string;
        zil: string;
    };
    txFees: IFeeOptions;
}

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('Transaction.transactionDetails')
});

class TransactionDetailsComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>> &
        IReduxProps,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> &
            IThemeProps<ReturnType<typeof stylesProvider>> &
            IReduxProps
    ) {
        super(props);

        this.state = {
            zilRewards: undefined,
            txFees: undefined
        };
    }

    public async componentDidMount() {
        const { account, transaction } = this.props;
        const { blockchain } = account;

        if (blockchain === Blockchain.ZILLIQA) {
            const blockchainConfig = getBlockchain(blockchain);
            const zilClient = blockchainConfig.getClient(this.props.chainId) as ZilliqaClient;

            try {
                const txFees = await zilClient.getTransactionFees(this.props.transaction.id);
                if (txFees) this.setState({ txFees });
            } catch (error) {
                SentryCaptureException(
                    new Error(JSON.stringify({ event: 'getTransactionFees', error }))
                );
            }

            if (transaction?.data?.raw) {
                try {
                    const raw = JSON.parse(transaction.data.raw);

                    if (raw?._tag === 'WithdrawStakeRewards') {
                        const zilRewards = await zilClient.fetchRewardsForTransaction(
                            this.props.transaction.id
                        );

                        // ZIL
                        const amountZil = blockchainConfig.account.amountFromStd(
                            new BigNumber(zilRewards.zil),
                            12
                        );
                        const formatAmountZil = formatNumber(amountZil, {
                            currency: blockchainConfig.config.coin,
                            maximumFractionDigits: 4
                        });

                        // gZIL
                        const amountGzil = blockchainConfig.account.amountFromStd(
                            new BigNumber(zilRewards.zil),
                            15
                        );
                        const formatAmountGzil = formatNumber(amountGzil, {
                            currency: 'gZIL',
                            maximumFractionDigits: 8
                        });

                        this.setState({
                            zilRewards: { zil: formatAmountZil, gZil: formatAmountGzil }
                        });
                    }
                } catch {
                    this.setState({ zilRewards: { zil: 'N/A', gZil: 'N/A' } });
                }
            }
        }
    }

    public goToExplorer() {
        const url = getBlockchain(this.props.account.blockchain)
            .networks.filter(n => n.chainId === this.props.chainId)[0]
            .explorer.getTransactionUrl(this.props.transaction.id);

        openURL(url);
    }

    public render() {
        const styles = this.props.styles;
        const transaction = this.props.transaction;
        const account = this.props.account;

        const date = new Date(transaction.date.created);

        const blockchainInstance = getBlockchain(account.blockchain);
        const coin = blockchainInstance.config.coin;
        const amount = blockchainInstance.transaction.getTransactionAmount(transaction);

        const tokenConfig = getTokenConfig(account.blockchain, transaction?.token?.symbol || coin);
        const tokenType = transaction?.token?.type;

        let recipient =
            tokenType === TokenType.ZRC2 || tokenType === TokenType.ERC20
                ? formatAddress(transaction.data.params[0], account.blockchain)
                : formatAddress(transaction.toAddress, account.blockchain);

        if (transaction?.additionalInfo?.validatorName) {
            recipient = transaction.additionalInfo.validatorName;
        }

        let transactionType = translate('App.labels.transfer');

        if (transaction.type === TransactionType.CONTRACT_DEPLOY) {
            transactionType = translate('App.labels.contractDeploy');
        }

        if (transaction.type === TransactionType.CONTRACT_CALL) {
            transactionType =
                translate('App.labels.contractCall') + ` (${Capitalize(transaction.data.method)})`;
        }

        if (tokenType === TokenType.ZRC2 || tokenType === TokenType.ERC20) {
            transactionType = Capitalize(transaction.data.method);
        }

        if (transaction?.additionalInfo?.posAction) {
            transactionType = Capitalize(transaction.additionalInfo.posAction)
                .split('_')
                .join(' ');
        }

        let isZilRewardsFlow = false;
        if (account.blockchain === Blockchain.ZILLIQA && transaction?.data?.raw) {
            try {
                const raw = JSON.parse(transaction.data.raw);
                if (raw?._tag === 'WithdrawStakeRewards') {
                    isZilRewardsFlow = true;
                }
            } catch (err) {
                // no need to handle this
            }
        }

        const txStatus = transaction.status;

        if (isZilRewardsFlow && !this.state.zilRewards) {
            return (
                <View style={styles.container}>
                    <LoadingIndicator />
                </View>
            );
        }

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
                    {isZilRewardsFlow ? (
                        <View>
                            {/* ZILLIQA ZIL and gZIL rewards */}
                            <View style={styles.rowContainer}>
                                <Text style={styles.textPrimary}>
                                    {txStatus === TransactionStatus.PENDING
                                        ? 'Waiting confirmation'
                                        : txStatus === TransactionStatus.SUCCESS
                                        ? this.state.zilRewards.zil
                                        : 'N/A'}
                                </Text>
                                <Text style={styles.textSecondary}>{'ZIL Rewards'}</Text>
                            </View>

                            <View style={styles.rowContainer}>
                                <Text style={styles.textPrimary}>
                                    {txStatus === TransactionStatus.PENDING
                                        ? 'Waiting confirmation'
                                        : txStatus === TransactionStatus.SUCCESS
                                        ? this.state.zilRewards.gZil
                                        : 'N/A'}
                                </Text>
                                <Text style={styles.textSecondary}>{'gZIL Rewards'}</Text>
                            </View>
                        </View>
                    ) : (
                        // Amount
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
                    )}

                    {/* Fees */}
                    {this.state.txFees?.feeTotal && (
                        <View style={styles.rowContainer}>
                            <Amount
                                style={styles.textPrimary}
                                amount={this.state.txFees.feeTotal}
                                blockchain={account.blockchain}
                                token={transaction?.token?.symbol || coin}
                                tokenDecimals={tokenConfig.decimals}
                            />
                            <Text style={styles.textSecondary}>{translate('App.labels.fee')}</Text>
                        </View>
                    )}

                    <View style={styles.rowContainer}>
                        <Text style={styles.textPrimary}>
                            {translate(
                                `Transaction.statusValue.${Capitalize(
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
                    {account.blockchain !== Blockchain.SOLANA && (
                        <View style={styles.rowContainer}>
                            <Text style={styles.textPrimary}>{transaction.nonce}</Text>
                            <Text style={styles.textSecondary}>
                                {translate('Transaction.nonce')}
                            </Text>
                        </View>
                    )}
                    {account.blockchain === Blockchain.SOLANA &&
                        transaction?.additionalInfo?.currentBlockHash && (
                            <TouchableOpacity
                                onPress={() => {
                                    Clipboard.setString(
                                        transaction.additionalInfo.currentBlockHash
                                    );
                                    Dialog.info(
                                        translate('App.labels.copied'),
                                        String(transaction.additionalInfo.currentBlockHash)
                                    );
                                }}
                            >
                                <View style={styles.rowContainer}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="middle"
                                        style={styles.textPrimary}
                                    >
                                        {transaction.additionalInfo.currentBlockHash}
                                    </Text>
                                    <Text style={styles.textSecondary}>{`Block Hash`}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
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
