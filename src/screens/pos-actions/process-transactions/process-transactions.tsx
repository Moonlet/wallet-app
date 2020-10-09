import React from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
import { Text, Button } from '../../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { smartConnect } from '../../../core/utils/smart-connect';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { translate } from '../../../core/i18n';
import Icon from '../../../components/icon/icon';
import { IconValues } from '../../../components/icon/values';
import { normalize } from '../../../styles/dimensions';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';
import { closeProcessTransactions } from '../../../redux/ui/process-transactions/actions';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { IBlockchainTransaction, ChainIdType } from '../../../core/blockchain/types';
import { TransactionStatus, WalletType } from '../../../core/wallet/types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../../core/utils/format-number';
import {
    getSelectedWallet,
    getSelectedAccountTransactions,
    getSelectedAccount
} from '../../../redux/wallets/selectors';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { formatValidatorName } from '../../../core/utils/format-string';
import { NavigationService } from '../../../navigation/navigation-service';
import { IAccountState, ITokenState, IWalletState } from '../../../redux/wallets/state';
import { getChainId } from '../../../redux/preferences/selectors';
import { bind } from 'bind-decorator';
import {
    addAccount,
    setSelectedAccount,
    signAndSendTransactions
} from '../../../redux/wallets/actions';
import { HeaderLeft } from '../../../components/header-left/header-left';
import { Dialog } from '../../../components/dialog/dialog';

interface IReduxProps {
    isVisible: boolean;
    transactions: IBlockchainTransaction[];
    signingInProgress: boolean;
    signingCompleted: boolean;
    signingError: boolean;
    currentTxIndex: number;
    closeProcessTransactions: typeof closeProcessTransactions;
    signAndSendTransactions: typeof signAndSendTransactions;
    selectedWallet: IWalletState;
    selectedAccount: IAccountState;
    accountTransactions: IBlockchainTransaction[];
    chainId: ChainIdType;
    createAccount: IAccountState;
    addAccount: typeof addAccount;
    setSelectedAccount: typeof setSelectedAccount;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);
    return {
        isVisible: state.ui.processTransactions.isVisible,
        transactions: state.ui.processTransactions.data.txs,
        signingInProgress: state.ui.processTransactions.data.signingInProgress,
        signingCompleted: state.ui.processTransactions.data.signingCompleted,
        signingError: state.ui.processTransactions.data.signingError,
        currentTxIndex: state.ui.processTransactions.data.currentTxIndex,
        createAccount: state.ui.processTransactions.data.createAccount,
        selectedWallet: getSelectedWallet(state),
        selectedAccount,
        chainId: selectedAccount ? getChainId(state, selectedAccount.blockchain) : '',
        accountTransactions: getSelectedAccountTransactions(state) || []
    };
};

const mapDispatchToProps = {
    closeProcessTransactions,
    addAccount,
    setSelectedAccount,
    signAndSendTransactions
};

interface IState {
    cardHeight: number;
}

export class ProcessTransactionsComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private iconSpinValue = new Animated.Value(0);

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            cardHeight: undefined
        };
    }

    public isTransactionPublished(transaction: IBlockchainTransaction): boolean {
        const filteredTransactions = this.props.accountTransactions.filter(
            tx => tx.id === transaction.id || transaction.status === TransactionStatus.SUCCESS
        );

        return filteredTransactions.length > 0;
    }

    private formatTopMiddleAndBottomText(
        tx: IBlockchainTransaction
    ): { topText: string; middleText: string; bottomText: string } {
        const tokenConfig = getTokenConfig(tx.blockchain, tx.token.symbol);
        const blockchainInstance = getBlockchain(tx.blockchain);
        const feesNumber =
            tx.feeOptions &&
            blockchainInstance.account.amountFromStd(
                new BigNumber(tx.feeOptions.feeTotal),
                tokenConfig.decimals
            );

        const fees =
            feesNumber &&
            formatNumber(new BigNumber(feesNumber), {
                currency: blockchainInstance.config.coin
            });

        if (tx.amount === '0' && tx.data?.params) {
            tx.amount = tx.data.params.length > 1 ? tx.data.params[1] : tx.data.params[0];
        }

        if (tx.additionalInfo?.posAction === PosBasicActionType.SEND) {
            tx.amount = tx.additionalInfo.actions[0].params[3].toString();
        }

        const amountNumber = blockchainInstance.account.amountFromStd(
            new BigNumber(tx.amount),
            tokenConfig.decimals
        );

        const amount = formatNumber(new BigNumber(amountNumber), {
            currency: blockchainInstance.config.coin
        });

        let middleText = '';
        let topText = '';
        const bottomText = '';

        switch (tx.additionalInfo?.posAction) {
            case PosBasicActionType.CREATE_ACCOUNT: {
                topText = translate('Transaction.registerAccount');
                break;
            }
            case PosBasicActionType.LOCK: {
                topText = translate('App.labels.locking') + ' ' + amount;
                break;
            }
            case PosBasicActionType.DELEGATE: {
                middleText =
                    translate('App.labels.to').toLowerCase() +
                    ' ' +
                    formatValidatorName(tx.additionalInfo?.validatorName, 20);
                topText = translate('App.labels.voting') + ' ' + amount;
                break;
            }
            case PosBasicActionType.UNLOCK: {
                topText = translate('App.labels.unlocking') + ' ' + amount;
                break;
            }
            case PosBasicActionType.UNVOTE: {
                middleText =
                    translate('App.labels.from').toLowerCase() +
                    ' ' +
                    formatValidatorName(tx.additionalInfo?.validatorName, 20);
                topText = translate('App.labels.unvoting') + ' ' + amount;
                break;
            }
            case PosBasicActionType.STAKE: {
                topText = translate('App.labels.stake') + ' ' + amount;
                middleText =
                    translate('App.labels.to').toLowerCase() +
                    ' ' +
                    formatValidatorName(tx.additionalInfo?.validatorName, 20);
                break;
            }
            case PosBasicActionType.CLAIM_REWARD: {
                topText = translate('App.labels.claimingRewards');
                middleText =
                    translate('App.labels.from').toLowerCase() +
                    ' ' +
                    formatValidatorName(tx.additionalInfo?.validatorName, 20);
                break;
            }
            case PosBasicActionType.UNSTAKE: {
                topText = translate('App.labels.unstaking') + ' ' + amount;
                middleText =
                    translate('App.labels.from').toLowerCase() +
                    ' ' +
                    formatValidatorName(tx.additionalInfo?.validatorName, 20);
                break;
            }
            case PosBasicActionType.ACTIVATE: {
                topText = translate('Validator.activatingVotes');
                break;
            }
            case PosBasicActionType.WITHDRAW: {
                topText = translate('App.labels.withdraw') + ' ' + amount;
                break;
            }
            case PosBasicActionType.SEND: {
                topText = translate('App.labels.sendingTokens');
                middleText = `${amount}`;
                break;
            }
            case PosBasicActionType.CREATE_ACCOUNT_AND_CLAIM: {
                topText = translate('App.labels.claimingAccount');
                middleText = tx.additionalInfo.actions[0].params[1].new_account_id;
                break;
            }
            case PosBasicActionType.SELECT_STAKING_POOL: {
                topText = translate('Validator.selectStakingPool');
                middleText = formatValidatorName(tx.additionalInfo?.validatorName, 20);
                break;
            }
            case PosBasicActionType.UNSELECT_STAKING_POOL: {
                topText = translate('Validator.unselectStakingPool');
                break;
            }
            default: {
                middleText = '';
                topText = amount;
            }
        }

        return { topText, middleText, bottomText: fees || bottomText };
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

    private renderCard(tx: IBlockchainTransaction, index: number) {
        const { styles, theme } = this.props;
        const status = tx.status;

        const { topText, middleText, bottomText } = this.formatTopMiddleAndBottomText(tx);

        let leftIcon = '';
        let rightText = '';
        let iconColor = '';
        let enableAnimation = false;

        const displayActivityIndicator =
            (status === TransactionStatus.SIGNED || status === TransactionStatus.CREATED) &&
            this.props.signingInProgress &&
            this.props.currentTxIndex === index;

        switch (status) {
            case TransactionStatus.FAILED: {
                leftIcon = IconValues.FAILED;
                rightText = translate('App.labels.failed');
                iconColor = theme.colors.disabledButton;
                break;
            }
            case TransactionStatus.SUCCESS: {
                leftIcon =
                    tx.additionalInfo?.posAction === PosBasicActionType.SEND ||
                    tx.additionalInfo?.posAction === PosBasicActionType.CREATE_ACCOUNT_AND_CLAIM
                        ? IconValues.OUTBOUND
                        : IconValues.VOTE;
                iconColor = theme.colors.accent;
                break;
            }
            case TransactionStatus.DROPPED: {
                leftIcon = IconValues.FAILED;
                rightText = translate('App.labels.canceled');
                iconColor = theme.colors.disabledButton;
                break;
            }
            case TransactionStatus.PENDING: {
                leftIcon = IconValues.PENDING;
                iconColor = theme.colors.warning;

                this.startIconSpin();
                enableAnimation = true;
                break;
            }
            case TransactionStatus.SIGNED: {
                leftIcon = IconValues.SIGNED;
                iconColor = theme.colors.accent;
                break;
            }
            case TransactionStatus.CREATED: {
                leftIcon = IconValues.SIGNED;
                iconColor = theme.colors.warning;
                break;
            }
            default: {
                leftIcon = IconValues.SIGNED;
                rightText = '';
                iconColor = theme.colors.warning;
            }
        }

        const isPublished = this.isTransactionPublished(tx);

        const iconSpin = this.iconSpinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['360deg', '0deg']
        });

        return (
            <View
                key={index + '-view-key'}
                style={styles.cardContainer}
                onLayout={event =>
                    !this.state.cardHeight &&
                    this.setState({ cardHeight: event.nativeEvent.layout.height })
                }
            >
                <Animated.View
                    style={[
                        styles.transactionIconContainer,
                        enableAnimation && { transform: [{ rotate: iconSpin }] }
                    ]}
                >
                    <Icon
                        name={leftIcon}
                        size={normalize(30)}
                        style={[styles.cardLeftIcon, { color: iconColor }]}
                    />
                </Animated.View>

                <View style={styles.cardTextContainer}>
                    <Text style={styles.topText}>{topText}</Text>
                    {middleText !== '' && <Text style={styles.middleText}>{middleText}</Text>}
                    {bottomText !== '' && (
                        <Text style={styles.bottomText}>
                            {translate('App.labels.maxFees') + ': ' + bottomText}
                        </Text>
                    )}
                </View>

                {isPublished ? (
                    status === TransactionStatus.PENDING || status === TransactionStatus.SUCCESS ? (
                        <Icon
                            name={IconValues.CHECK}
                            size={normalize(16)}
                            style={styles.successIcon}
                        />
                    ) : (
                        <Text style={styles.failedText}>{rightText}</Text>
                    )
                ) : !displayActivityIndicator ? (
                    <View />
                ) : (
                    <View>
                        <LoadingIndicator />
                    </View>
                )}
            </View>
        );
    }

    @bind
    private onPressContinue() {
        if (this.props.transactions.length) {
            if (this.props.createAccount) {
                this.props.addAccount(
                    this.props.selectedWallet.id,
                    this.props.createAccount.blockchain,
                    this.props.createAccount
                );
                this.props.setSelectedAccount(this.props.createAccount);
                NavigationService.navigate('Dashboard', {});
            } else {
                const blockchainInstance = getBlockchain(this.props.transactions[0].blockchain);
                const token: ITokenState = this.props.selectedAccount.tokens[this.props.chainId][
                    blockchainInstance.config.coin
                ];
                NavigationService.popToTop();
                NavigationService.navigate('Token', {
                    blockchain: this.props.selectedAccount.blockchain,
                    accountIndex: this.props.selectedAccount.index,
                    token,
                    activeTab: blockchainInstance.config.ui?.token?.labels?.tabTransactions
                });
            }
        }

        this.props.closeProcessTransactions();
    }

    @bind
    private onPressSignTransaction(transaction: IBlockchainTransaction) {
        throw new Error('check this out!!!');
        // this.props.signAndSendTransactions([transaction], this.props.currentTxIndex);
    }

    @bind
    private signAllTransactions() {
        // sign all transactions - HD wallet
        this.props.signAndSendTransactions(this.props.transactions);
    }

    public renderBottomButton() {
        const { styles } = this.props;
        if (this.props.transactions.length === 0) return <View />;

        if (this.props.signingCompleted) {
            return (
                <Button
                    primary
                    onPress={this.onPressContinue}
                    wrapperStyle={styles.continueButton}
                    disabled={false}
                >
                    {translate('App.labels.continue')}
                </Button>
            );
        } else {
            if (this.props.selectedWallet.type === WalletType.HD)
                return (
                    <Button
                        primary
                        onPress={this.signAllTransactions}
                        wrapperStyle={styles.continueButton}
                        disabled={this.props.signingInProgress}
                    >
                        {translate('Transaction.signAll')}
                    </Button>
                );
            else
                return (
                    <Button
                        primary
                        onPress={() =>
                            this.onPressSignTransaction(
                                this.props.transactions[this.props.currentTxIndex]
                            )
                        }
                        wrapperStyle={styles.continueButton}
                        disabled={false}
                    >
                        {translate('ProcessTransactions.ledgerSignButton', {
                            txNumber: this.props.currentTxIndex + 1
                        })}
                    </Button>
                );
        }
    }

    @bind
    private onPressBackButton() {
        if (this.props.signingInProgress) {
            Dialog.alert(
                translate('ProcessTransactions.alertCancelTitle'),
                translate('ProcessTransactions.alertCancelMessage'),
                {
                    text: translate('App.labels.no')
                },
                {
                    text: translate('App.labels.yes'),
                    onPress: () => this.props.closeProcessTransactions()
                }
            );
        } else this.props.closeProcessTransactions();
    }

    public render() {
        const { styles } = this.props;

        const title =
            this.props.selectedWallet?.type === WalletType.HW
                ? translate('Transaction.processTitleTextLedger')
                : translate('Transaction.processTitleText');

        if (this.props.isVisible) {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.defaultHeaderContainer}>
                            {!this.props.signingInProgress && !this.props.signingCompleted && (
                                <HeaderLeft
                                    testID="go-back"
                                    icon={IconValues.ARROW_LEFT}
                                    onPress={this.onPressBackButton}
                                />
                            )}
                        </View>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitleStyle}>
                                {translate('Transaction.signTransactions')}
                            </Text>
                        </View>
                        <View style={styles.defaultHeaderContainer} />
                    </View>

                    <Text style={styles.title}>{title}</Text>

                    {this.props.transactions.length ? (
                        <ScrollView contentContainerStyle={styles.contentScrollView}>
                            {this.props.transactions.map((tx, index) => this.renderCard(tx, index))}
                        </ScrollView>
                    ) : (
                        <LoadingIndicator />
                    )}

                    {this.renderBottomButton()}
                </View>
            );
        } else {
            return null;
        }
    }
}

export const ProcessTransactions = smartConnect(ProcessTransactionsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
