import React from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Easing,
    RefreshControl
} from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { Text } from '../../../library';
import { IAccountState } from '../../../redux/wallets/state';
import { normalize } from '../../../styles/dimensions';
import { Amount } from '../../../components/amount/amount';
import { translate } from '../../../core/i18n';
import { formatAddress } from '../../../core/utils/format-address';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import moment from 'moment';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { IBlockchainTransaction, TransactionType } from '../../../core/blockchain/types';
import { TransactionStatus } from '../../../core/wallet/types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { IconValues } from '../../../components/icon/values';
import {
    PosBasicActionType,
    SwapContractMethod,
    TokenType
} from '../../../core/blockchain/types/token';
import bind from 'bind-decorator';
import { Capitalize } from '../../../core/utils/format-string';

interface IExternalProps {
    transactions: IBlockchainTransaction[];
    account: IAccountState;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    onRefresh: () => void;
}

interface IState {
    refreshing: boolean;
}

export class TransactionsHistoryListComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public iconSpinValue = new Animated.Value(0);
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            refreshing: false
        };
    }

    public getTransactionPrimaryText(tx: IBlockchainTransaction, account: IAccountState) {
        let formattedAmount =
            tx.address === account.address
                ? translate('App.labels.to').toLowerCase()
                : translate('App.labels.from').toLowerCase();

        let toAddress =
            tx?.token?.type === TokenType.ZRC2 || tx?.token?.type === TokenType.ERC20
                ? formatAddress(tx.data.params[0], account.blockchain)
                : formatAddress(tx.toAddress, account.blockchain);

        if (tx.additionalInfo?.validatorName) {
            toAddress = tx.additionalInfo.validatorName;
        }

        if (tx.additionalInfo?.validator?.name) {
            toAddress = tx.additionalInfo.validator.name;
        }

        let primaryText = '';

        if (tx.type === TransactionType.CONTRACT_DEPLOY) {
            primaryText = translate('App.labels.contractDeploy');
        } else if (tx.type === TransactionType.CONTRACT_CALL) {
            primaryText = translate('App.labels.contractCall');
        }

        switch (tx.additionalInfo?.posAction) {
            case PosBasicActionType.SOLANA_STAKEACCOUNT_DELEGATE:
            case PosBasicActionType.DELEGATE: {
                formattedAmount = translate('App.labels.to').toLowerCase();
                primaryText = ` ${formattedAmount} ${toAddress}`;
                break;
            }
            case PosBasicActionType.UNVOTE: {
                formattedAmount = translate('App.labels.from').toLowerCase();
                primaryText = ` ${formattedAmount} ${toAddress}`;
                break;
            }
            case PosBasicActionType.STAKE: {
                formattedAmount = translate('App.labels.to').toLowerCase();
                primaryText = ` ${formattedAmount} ${toAddress}`;
                break;
            }
            case PosBasicActionType.SOLANA_STAKEACCOUNT_UNSTAKE:
            case PosBasicActionType.UNSTAKE: {
                formattedAmount = translate('App.labels.from').toLowerCase();
                primaryText = ` ${formattedAmount} ${toAddress}`;
                break;
            }
            case PosBasicActionType.CLAIM_REWARD:
            case PosBasicActionType.CLAIM_REWARD_NO_INPUT: {
                formattedAmount = translate('App.labels.from').toLowerCase();
                primaryText = ` ${formattedAmount} ${toAddress}`;
                break;
            }
            case PosBasicActionType.SELECT_STAKING_POOL:
                primaryText =
                    Capitalize(tx.additionalInfo.posAction)
                        .split('_')
                        .join(' ') + ` - ${toAddress}`;
                break;
            case PosBasicActionType.WITHDRAW:
                if (tx.additionalInfo.stakeAccountKey) {
                    primaryText =
                        ' ' +
                        translate('App.labels.from').toLowerCase() +
                        ' ' +
                        formatAddress(tx.additionalInfo.stakeAccountKey, account.blockchain);
                }
                break;
            case PosBasicActionType.UNSELECT_STAKING_POOL:
                primaryText = Capitalize(tx.additionalInfo.posAction)
                    .split('_')
                    .join(' ');
                break;
            case PosBasicActionType.CREATE_STAKE_ACCOUNT:
            case PosBasicActionType.SOLANA_STAKEACCOUNT_CREATE:
            case PosBasicActionType.SOLANA_STAKEACCOUNT_SPLIT:
            case PosBasicActionType.SPLIT_STAKE:
                primaryText = undefined;
                break;
            default:
                primaryText = ` ${formattedAmount} ${toAddress}`;
        }

        return primaryText;
    }

    private startIconSpin() {
        Animated.loop(
            Animated.timing(this.iconSpinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            })
        ).start();
    }

    private transactionItem(tx: IBlockchainTransaction, index: number) {
        const { account, styles, theme } = this.props;

        const blockchainInstance = getBlockchain(account.blockchain);
        let amount = blockchainInstance.transaction.getTransactionAmount(tx);

        const date = new Date(tx.date.created);

        let txIcon: string;
        let txColor: string;
        let enableAnimation = false;

        switch (tx.status) {
            case TransactionStatus.PENDING:
                txIcon = IconValues.PENDING;
                txColor = theme.colors.warning;
                this.startIconSpin();
                enableAnimation = true;
                break;
            case TransactionStatus.SUCCESS:
                const accountAddress = account.address.toLowerCase();
                const address = tx.address.toLowerCase();

                let toAddress = tx.toAddress.toLowerCase();

                if (tx?.token?.type === TokenType.ZRC2 || tx?.token?.type === TokenType.ERC20) {
                    toAddress = tx.data?.params && tx.data?.params[0];
                }

                // remove amount from primary text
                if (
                    tx.additionalInfo?.posAction === PosBasicActionType.SELECT_STAKING_POOL ||
                    tx.additionalInfo?.posAction === PosBasicActionType.UNSELECT_STAKING_POOL
                ) {
                    amount = null;
                }

                if (
                    tx.data?.method ||
                    (tx.additionalInfo?.actions && tx.additionalInfo.actions[0]?.params) ||
                    tx.additionalInfo?.posAction
                ) {
                    txIcon = IconValues.VOTE;
                    txColor = theme.colors.accent;
                } else if (accountAddress === address) {
                    txIcon = IconValues.OUTBOUND;
                    txColor = theme.colors.error;
                } else if (accountAddress === toAddress) {
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

        const txTokenConfig = getTokenConfig(tx.blockchain, tx?.token?.symbol || coin);

        const iconSpin = this.iconSpinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['360deg', '0deg']
        });

        let transactionType: string;

        if (tx.additionalInfo?.actions) {
            for (const action of tx.additionalInfo.actions) {
                if (action?.type === TransactionType.TRANSFER) {
                    transactionType = translate('App.labels.transfer') + ' ';
                }
            }
        }

        switch (tx.type) {
            case TransactionType.TRANSFER:
                transactionType = translate('App.labels.transfer') + ' ';
                break;
            case TransactionType.CONTRACT_DEPLOY:
            case TransactionType.CONTRACT_CALL:
                transactionType = '';
                break;
        }

        if (tx?.token?.type === TokenType.ZRC2 || tx?.token?.type === TokenType.ERC20) {
            transactionType = Capitalize(tx.data.method) + ' ';
        }

        if (tx.additionalInfo?.posAction) {
            const posAction = tx.additionalInfo.posAction;
            if (
                posAction === PosBasicActionType.STAKE ||
                posAction === PosBasicActionType.UNSTAKE ||
                posAction === PosBasicActionType.WITHDRAW
            ) {
                transactionType = Capitalize(posAction) + ' ';
            }

            if (
                posAction === PosBasicActionType.CLAIM_REWARD ||
                posAction === PosBasicActionType.CLAIM_REWARD_NO_INPUT
            ) {
                transactionType = translate('App.labels.claimingRewards');
            }

            if (
                posAction === PosBasicActionType.CREATE_STAKE_ACCOUNT ||
                posAction === PosBasicActionType.SOLANA_STAKEACCOUNT_CREATE ||
                posAction === PosBasicActionType.SOLANA_STAKEACCOUNT_SPLIT ||
                posAction === PosBasicActionType.SPLIT_STAKE
            ) {
                transactionType = translate('App.labels.createStakeAccount') + ' ';
            }
        }

        if (tx.additionalInfo?.swap) {
            switch (tx.additionalInfo?.swap.contractMethod) {
                case SwapContractMethod.INCREASEALLOWANCE:
                    transactionType = translate('App.labels.increaseAllowance') + ' ';
                    break;
                case SwapContractMethod.SWAPEXACTTOKENSFORZIL:
                    transactionType = translate('App.labels.swap') + ' ';
                    break;
                case SwapContractMethod.SWAPEXACTZILFORTOKENS:
                    transactionType = translate('App.labels.swap') + ' ';
                    break;
                default:
                    transactionType = '';
            }
        }

        return (
            <TouchableOpacity
                testID={`transaction-${index}`}
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
                <Animated.View
                    style={[
                        styles.transactionIconContainer,
                        enableAnimation && { transform: [{ rotate: iconSpin }] }
                    ]}
                >
                    <Icon
                        name={txIcon}
                        size={normalize(30)}
                        style={[styles.transactionIcon, { color: txColor }]}
                    />
                </Animated.View>
                <View style={styles.transactionTextContainer}>
                    <View style={styles.transactionAmountContainer}>
                        <Text style={styles.transactionTextPrimary}>{transactionType}</Text>
                        {amount && (
                            <Amount
                                amount={amount}
                                blockchain={account.blockchain}
                                token={txTokenConfig.symbol || coin}
                                tokenDecimals={txTokenConfig.decimals}
                            />
                        )}

                        <Text
                            style={styles.transactionTextPrimary}
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                        >
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

    @bind
    private onRefresh() {
        this.props.onRefresh();

        this.setState({ refreshing: true }, () => {
            setTimeout(() => this.setState({ refreshing: false }), 1500);
        });
    }

    public render() {
        const { transactions, styles, theme } = this.props;

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
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                                tintColor={theme.colors.accent}
                                title={`${translate('App.labels.refreshing')}...`}
                                titleColor={theme.colors.accent}
                            />
                        }
                    >
                        {transactions.map((tx: IBlockchainTransaction, index: number) =>
                            this.transactionItem(tx, index)
                        )}
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
