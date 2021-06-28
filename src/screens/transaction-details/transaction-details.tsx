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
import { getAccount, getSelectedAccountTransaction } from '../../redux/wallets/selectors';
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
import { updateTransactionFromBlockchain } from '../../redux/wallets/actions';

interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    txRedux: IBlockchainTransaction;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
}

interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    transaction: IBlockchainTransaction;
}

const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId: getChainId(state, ownProps.blockchain),
        txRedux: getSelectedAccountTransaction(state, ownProps.transaction.id)
    };
};

const mapDispatchToProps = {
    updateTransactionFromBlockchain
};

interface IState {
    transaction: IBlockchainTransaction;
    zilRewards: {
        gZil: string;
        zil: string;
    };
    txFees: IFeeOptions;
    errorMessage: {
        message: string;
    };
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
            transaction: props.transaction,
            zilRewards: undefined,
            txFees: undefined,
            errorMessage: undefined
        };
    }

    public async componentDidMount() {
        const { account, chainId } = this.props;
        const { transaction } = this.state;
        const { blockchain } = account;

        if (transaction.status === TransactionStatus.DROPPED) {
            this.props.updateTransactionFromBlockchain(
                transaction.id,
                blockchain,
                chainId,
                transaction.broadcastedOnBlock
            );
        }

        if (blockchain === Blockchain.ZILLIQA) {
            const blockchainConfig = getBlockchain(blockchain);
            const zilClient = blockchainConfig.getClient(chainId) as ZilliqaClient;

            try {
                const txFees = await zilClient.getTransactionFees(transaction.id);
                if (txFees) this.setState({ txFees });
            } catch (error) {
                SentryCaptureException(
                    new Error(JSON.stringify({ event: 'getTransactionFees', error }))
                );
            }

            try {
                if (transaction?.additionalInfo?.swap) {
                    const errorMessage = await zilClient.getTransactionErrorMessage(transaction.id);

                    if (errorMessage) this.setState({ errorMessage });
                }
            } catch (error) {
                SentryCaptureException(
                    new Error(JSON.stringify({ event: 'getTransactionErrorMessage', error }))
                );
            }

            if (transaction?.data?.raw) {
                try {
                    const raw = JSON.parse(transaction.data.raw);

                    if (raw?._tag === 'WithdrawStakeRewards') {
                        const zilRewards = await zilClient.fetchRewardsForTransaction(
                            transaction.id
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

    public componentDidUpdate(prevProps: INavigationParams & IReduxProps) {
        if (
            this.props.txRedux &&
            JSON.stringify(this.props.txRedux) !== JSON.stringify(prevProps.txRedux)
        ) {
            this.setState({ transaction: this.props.txRedux });
        }
    }

    public goToExplorer() {
        const url = getBlockchain(this.props.account.blockchain)
            .networks.filter(n => n.chainId === this.props.chainId)[0]
            .explorer.getTransactionUrl(this.state.transaction.id);

        openURL(url);
    }

    public render() {
        const { account, styles } = this.props;
        const { transaction } = this.state;

        const date = new Date(transaction.date.created);

        const blockchain = account.blockchain;

        const blockchainInstance = getBlockchain(blockchain);
        const coin = blockchainInstance.config.coin;
        const amount = blockchainInstance.transaction.getTransactionAmount(transaction);

        const tokenConfig = getTokenConfig(blockchain, transaction?.token?.symbol || coin);
        const nativeCoinTokenConfig = getTokenConfig(blockchain, coin);
        const tokenType = transaction?.token?.type;

        let recipient =
            tokenType === TokenType.ZRC2 || tokenType === TokenType.ERC20
                ? formatAddress(transaction.data.params[0], blockchain)
                : formatAddress(transaction.toAddress, blockchain);

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
            if (!!transaction.additionalInfo?.swap) {
                transactionType = translate(`ContractMethod.${transaction.data.method}`);
            }
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
                                blockchain={blockchain}
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
                                blockchain={blockchain}
                                token={coin}
                                tokenDecimals={nativeCoinTokenConfig.decimals}
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

                    {this.state.errorMessage?.message && (
                        <View style={styles.rowContainer}>
                            <Text style={styles.textPrimary}>
                                {this.state.errorMessage.message}
                            </Text>
                            <Text style={styles.textSecondary}>
                                {translate('App.labels.errorMessage')}
                            </Text>
                        </View>
                    )}

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

export const TransactionDetails = smartConnect(TransactionDetailsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
