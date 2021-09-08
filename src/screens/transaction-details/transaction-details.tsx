import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Icon } from '../../components/icon/icon';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Button, Text } from '../../library';
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
import { Client as SolanaClient } from '../../core/blockchain/solana/client';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../core/utils/format-number';
import { Dialog } from '../../components/dialog/dialog';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';
import { removeTransaction, updateTransactionFromBlockchain } from '../../redux/wallets/actions';
import { NavigationService } from '../../navigation/navigation-service';
import { isSwapTx } from '../../core/utils/swap';

interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    txRedux: IBlockchainTransaction;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
    removeTransaction: typeof removeTransaction;
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
    updateTransactionFromBlockchain,
    removeTransaction
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
    headerLeft: () => <HeaderLeftClose navigation={navigation} />,
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
                txFees && this.setState({ txFees });
            } catch (error) {
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        data: {
                            txId: transaction.id
                        },
                        error
                    })
                });

                SentryCaptureException(
                    new Error(`Fetch ZIL getTransactionFees, ${error?.message}`)
                );
            }

            try {
                if (transaction?.additionalInfo?.swap) {
                    const errorMessage = await zilClient.getTransactionErrorMessage(transaction.id);
                    errorMessage && this.setState({ errorMessage });
                }
            } catch (error) {
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        data: {
                            txId: transaction.id
                        },
                        error
                    })
                });

                SentryCaptureException(
                    new Error(`Fetch ZIL getTransactionErrorMessage, ${error?.message}`)
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

        if (blockchain === Blockchain.SOLANA) {
            const blockchainConfig = getBlockchain(blockchain);
            const solClient = blockchainConfig.getClient(chainId) as SolanaClient;

            try {
                const txFees = await solClient.getTransactionFees(transaction.id);
                txFees && this.setState({ txFees });
            } catch (error) {
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        data: {
                            txId: transaction.id
                        },
                        error
                    })
                });

                SentryCaptureException(
                    new Error(`Fetch SOL getTransactionFees, ${error?.message}`)
                );
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

    private renderRow(title: string, body: string) {
        const { styles } = this.props;

        return (
            <View style={styles.rowContainer}>
                <Text style={styles.textPrimary}>{title}</Text>
                <Text style={styles.textSecondary}>{body}</Text>
            </View>
        );
    }

    private removeTransaction() {
        Dialog.alert(
            translate('App.labels.removeTransaction'),
            translate('App.labels.removeTransactionDetails'),
            {
                text: translate('App.labels.cancel'),
                onPress: () => {
                    //
                }
            },
            {
                text: translate('App.labels.ok'),
                onPress: () => {
                    this.props.removeTransaction(this.state.transaction.id);
                    NavigationService.goBack();
                }
            }
        );
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
                ? transaction.data.params[0]
                : transaction.toAddress;

        if (transaction?.additionalInfo?.validatorName) {
            recipient = transaction.additionalInfo.validatorName;
        }

        if (blockchain === Blockchain.SOLANA && transaction.additionalInfo?.stakeAccountKey) {
            recipient = transaction.additionalInfo.stakeAccountKey;
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
                    contentContainerStyle={styles.scrollConainter}
                    showsVerticalScrollIndicator={false}
                >
                    {this.renderRow(
                        `${moment(date).format('L')}, ${moment(date).format('LTS')}`,
                        translate('App.labels.dateAndTime')
                    )}

                    {this.renderRow(transactionType, translate('Transaction.transactionType'))}

                    {isSwapTx(transaction) &&
                        this.renderRow(
                            transaction.additionalInfo?.swap.fromTokenAmount +
                                ' ' +
                                transaction.additionalInfo?.swap.fromTokenSymbol +
                                ' ' +
                                translate('App.labels.to').toLowerCase() +
                                ' ' +
                                transaction.additionalInfo?.swap.toTokenAmount +
                                ' ' +
                                transaction.additionalInfo?.swap.toTokenSymbol,
                            translate('App.labels.swap')
                        )}

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
                                uiDecimals={6}
                            />
                            <Text style={styles.textSecondary}>{translate('App.labels.fee')}</Text>
                        </View>
                    )}

                    {this.renderRow(
                        translate(
                            `Transaction.statusValue.${Capitalize(transaction.status.toString())}`
                        ),
                        translate('Transaction.transactionStatus')
                    )}

                    {this.state.errorMessage?.message &&
                        this.renderRow(
                            this.state.errorMessage.message,
                            translate('App.labels.errorMessage')
                        )}

                    <TouchableOpacity
                        onPress={() => {
                            Clipboard.setString(transaction.address);
                            Dialog.info(
                                translate('App.labels.copied'),
                                String(transaction.address)
                            );
                        }}
                    >
                        {this.renderRow(
                            formatAddress(transaction.address, account.blockchain),
                            translate('App.labels.sender')
                        )}
                    </TouchableOpacity>

                    {recipient && recipient !== '' && (
                        <TouchableOpacity
                            onPress={() => {
                                Clipboard.setString(recipient);
                                Dialog.info(translate('App.labels.copied'), String(recipient));
                            }}
                        >
                            {this.renderRow(recipient, translate('App.labels.recipient'))}
                        </TouchableOpacity>
                    )}

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

                    {account.blockchain !== Blockchain.SOLANA &&
                        this.renderRow(String(transaction.nonce), translate('Transaction.nonce'))}

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
                                    <Text style={styles.textSecondary}>
                                        {translate('App.labels.blockHash')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                    <Button
                        style={styles.removeTxButton}
                        textStyle={styles.removeTxButtonText}
                        onPress={() => this.removeTransaction()}
                    >
                        {translate('App.labels.removeTransaction')}
                    </Button>
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
