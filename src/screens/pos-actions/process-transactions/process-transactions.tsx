import React from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
import SafeAreaView, { SafeAreaProvider } from 'react-native-safe-area-view';
import { Text, Button } from '../../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { smartConnect } from '../../../core/utils/smart-connect';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { translate } from '../../../core/i18n';
import Icon from '../../../components/icon/icon';
import { IconValues } from '../../../components/icon/values';
import { BASE_DIMENSION, normalize } from '../../../styles/dimensions';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';
import { closeProcessTransactions } from '../../../redux/ui/process-transactions/actions';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { IBlockchainTransaction, ChainIdType, Blockchain } from '../../../core/blockchain/types';
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
import { PosBasicActionType, ContractMethod } from '../../../core/blockchain/types/token';
import { Capitalize, formatValidatorName } from '../../../core/utils/format-string';
import { NavigationService } from '../../../navigation/navigation-service';
import { IAccountState, ITokenState, IWalletState } from '../../../redux/wallets/state';
import { getChainId } from '../../../redux/preferences/selectors';
import { bind } from 'bind-decorator';
import { addAccount, setSelectedAccount } from '../../../redux/wallets/actions';
import { HeaderLeft } from '../../../components/header-left/header-left';
import { Dialog } from '../../../components/dialog/dialog';
import { availableAmount } from '../../../core/utils/available-funds';
import { signAndSendTransactions } from '../../../redux/wallets/actions/util-actions';
import { PercentageCircle } from '../../../components/widgets/components/progress-circle/progress-circle';
import { IExchangeRates } from '../../../redux/market/state';
import { convertAmount } from '../../../core/utils/balance';
import { isSwapTx } from '../../../core/utils/swap';
import { Widgets } from '../../../components/widgets/widgets';
import {
    IScreenContext,
    IScreenValidation,
    IScreenWidget
} from '../../../components/widgets/types';
import { fetchScreenData, resetScreenData } from '../../../redux/ui/screens/data/actions';
import { handleCta } from '../../../redux/ui/screens/data/handle-cta';
import {
    clearScreenInputData,
    runScreenValidation,
    runScreenStateActions,
    setScreenInputData
} from '../../../redux/ui/screens/input-data/actions';
import { IScreenData, IScreensData } from '../../../redux/ui/screens/data/state';
import { getScreenDataKey } from '../../../redux/ui/screens/data/reducer';

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
    exchangeRates: IExchangeRates;

    screenData: IScreensData;

    fetchScreenData: typeof fetchScreenData;
    handleCta: typeof handleCta;
    clearScreenInputData: typeof clearScreenInputData;
    runScreenValidation: typeof runScreenValidation;
    runScreenStateActions: typeof runScreenStateActions;
    setScreenInputData: typeof setScreenInputData;
    resetScreenData: typeof resetScreenData;
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
        accountTransactions: getSelectedAccountTransactions(state) || [],
        exchangeRates: state.market.exchangeRates,
        screenData: state.ui.screens.data?.ProcessTransactionsScreen
    };
};

const mapDispatchToProps = {
    closeProcessTransactions,
    addAccount,
    setSelectedAccount,
    signAndSendTransactions,

    fetchScreenData,
    handleCta,
    clearScreenInputData,
    runScreenValidation,
    runScreenStateActions,
    setScreenInputData,
    resetScreenData
};

interface IState {
    cardHeight: number;
    txContainerHeight: number;
    insufficientFundsFees: boolean;
    warningFeesToHigh: boolean;
    amountNeededToPassTxs: string;
    context: IScreenContext;
}

class ProcessTransactionsComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private iconSpinValue = new Animated.Value(0);
    private scrollViewRef: any;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            cardHeight: undefined,
            txContainerHeight: undefined,
            insufficientFundsFees: false,
            warningFeesToHigh: false,
            amountNeededToPassTxs: '',
            context: {
                screen: 'ProcessTransactionsScreen'
            }
        };
        this.scrollViewRef = React.createRef();
    }

    public async componentDidUpdate(prevProps: IReduxProps) {
        if (
            this.props.signingInProgress === true &&
            this.props.currentTxIndex !== prevProps.currentTxIndex
        ) {
            this.state.cardHeight &&
                this.state.txContainerHeight &&
                this.scrollViewRef.scrollTo({
                    y:
                        (this.props.currentTxIndex +
                            1 -
                            Math.floor(this.state.txContainerHeight / this.state.cardHeight)) *
                        this.state.cardHeight,
                    animated: true
                });
        }

        // Check fees for insufficient funds
        if (this.props.transactions !== prevProps.transactions) {
            if (this.props.transactions.length) {
                const screenKey = this.getScreenKey(this.props);
                this.props.resetScreenData(this.state.context, screenKey);

                let insufficientFundsFees = false;
                let warningFeesToHigh = false;

                const blockchain = this.props.selectedAccount.blockchain;
                const blockchainInstance = getBlockchain(blockchain);
                const nativeCoin = blockchainInstance.config.coin;
                const nativeTokenConfig = getTokenConfig(blockchain, nativeCoin);
                const tokenConfig = getTokenConfig(
                    blockchain,
                    isSwapTx(this.props.transactions[0])
                        ? this.props.transactions[0].additionalInfo.swap.fromTokenSymbol
                        : this.props.transactions[0].token.symbol
                );
                const nativeTokenState = this.props.selectedAccount.tokens[this.props.chainId][
                    nativeTokenConfig.symbol
                ];

                let accountAvailableAmountForFees = await availableAmount(
                    this.props.selectedAccount,
                    nativeTokenState,
                    this.props.chainId,
                    {}
                );

                let txValueToUseFromAmountStd = new BigNumber(0);
                let feesAmountStd = new BigNumber(0);
                let isStakeAction = false;

                for (const transaction of this.props.transactions) {
                    if (
                        transaction.additionalInfo?.posAction === PosBasicActionType.STAKE ||
                        transaction.additionalInfo?.posAction === PosBasicActionType.DELEGATE ||
                        (isSwapTx(transaction) &&
                            transaction.additionalInfo.swap.fromTokenSymbol ===
                                nativeTokenConfig.symbol)
                    ) {
                        if (transaction.amount === '0' && transaction.data?.params) {
                            const amount =
                                transaction.data.params.length > 1
                                    ? transaction.data.params[1]
                                    : transaction.data.params[0];
                            txValueToUseFromAmountStd = txValueToUseFromAmountStd.plus(amount);
                        } else {
                            txValueToUseFromAmountStd = txValueToUseFromAmountStd.plus(
                                transaction.amount
                            );
                        }
                    }

                    if (
                        transaction.additionalInfo?.posAction === PosBasicActionType.STAKE ||
                        transaction.additionalInfo?.posAction === PosBasicActionType.DELEGATE
                    ) {
                        isStakeAction = true;
                    }
                    feesAmountStd = feesAmountStd.plus(transaction.feeOptions?.feeTotal || '0');
                }

                // This is applied only on Solana, because you cand stake from unstaked balance
                if (
                    isStakeAction &&
                    blockchain === Blockchain.SOLANA &&
                    nativeTokenState?.balance?.available &&
                    nativeTokenState?.balance?.unstaked
                ) {
                    accountAvailableAmountForFees = await availableAmount(
                        this.props.selectedAccount,
                        nativeTokenState,
                        this.props.chainId,
                        {
                            balanceAvailable: new BigNumber(nativeTokenState.balance.available)
                                .plus(new BigNumber(nativeTokenState.balance.unstaked))
                                .toFixed()
                        }
                    );
                }

                const feesAmount = blockchainInstance.account.amountFromStd(
                    feesAmountStd,
                    nativeTokenConfig.decimals
                );
                const txValueToUseFromAmount = blockchainInstance.account.amountFromStd(
                    txValueToUseFromAmountStd,
                    tokenConfig.decimals
                );

                if (tokenConfig.symbol.toLowerCase() === nativeTokenConfig.symbol.toLowerCase()) {
                    const txAmountWithFees = txValueToUseFromAmount.plus(feesAmount);

                    if (txAmountWithFees.isGreaterThan(accountAvailableAmountForFees)) {
                        insufficientFundsFees = true;
                    }

                    if (
                        feesAmount.isGreaterThan(txValueToUseFromAmount) &&
                        txValueToUseFromAmount.isGreaterThan(0) &&
                        isStakeAction === true
                    ) {
                        warningFeesToHigh = true;
                    }
                } else {
                    if (txValueToUseFromAmount.isGreaterThan(0)) {
                        const feesConverted = convertAmount(
                            blockchain,
                            this.props.exchangeRates,
                            blockchainInstance.account
                                .amountToStd(feesAmount.toFixed(4), nativeTokenConfig.decimals)
                                .toFixed(),
                            nativeTokenConfig.symbol,
                            'USD',
                            nativeTokenConfig.decimals // irelevant since its to USD
                        );

                        const txAmountConverted = convertAmount(
                            blockchain,
                            this.props.exchangeRates,
                            blockchainInstance.account
                                .amountToStd(
                                    txValueToUseFromAmount.toFixed(4),
                                    tokenConfig.decimals
                                )
                                .toFixed(),
                            tokenConfig.symbol,
                            'USD',
                            tokenConfig.decimals // irelevant since its to USD
                        );

                        if (
                            feesConverted.isGreaterThan(txAmountConverted) &&
                            isStakeAction === true
                        ) {
                            warningFeesToHigh = true;
                        }
                    }
                }

                this.setState(
                    {
                        insufficientFundsFees,
                        warningFeesToHigh,
                        context: {
                            ...this.state.context,
                            params: {
                                transactions: this.props.transactions,
                                blockchain
                            }
                        }
                    },
                    () => this.props.fetchScreenData(this.state.context)
                );
            }
        }
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
        const blockchainInstance = getBlockchain(tx.blockchain);
        const nativeCoin = blockchainInstance.config.coin;

        const nativeTokenConfig = getTokenConfig(tx.blockchain, nativeCoin);
        const tokenConfig = getTokenConfig(tx.blockchain, tx.token.symbol);

        // fees are always paid in native token
        const feesNumber =
            tx.feeOptions &&
            blockchainInstance.account.amountFromStd(
                new BigNumber(tx.feeOptions.feeTotal),
                nativeTokenConfig.decimals
            );

        const fees =
            feesNumber &&
            formatNumber(new BigNumber(feesNumber), {
                currency: nativeCoin
            });

        let amount = tx.amount;

        if (amount === '0' && tx.data?.params) {
            amount = tx.data.params.length > 1 ? tx.data.params[1] : tx.data.params[0];
        }

        if (tx.additionalInfo?.posAction === PosBasicActionType.SEND) {
            amount = tx.additionalInfo.actions[0].params[3].toString();
        }

        const amountNumber = blockchainInstance.account.amountFromStd(
            new BigNumber(amount),
            tokenConfig.decimals
        );

        amount = formatNumber(new BigNumber(amountNumber), {
            currency: tx.additionalInfo?.tokenSymbol || nativeCoin
        });

        let middleText = '';
        let topText = '';
        const bottomText = '';

        switch (tx.additionalInfo?.posAction) {
            case PosBasicActionType.CREATE_ACCOUNT: {
                topText = translate('Transaction.registerAccount');
                break;
            }
            case PosBasicActionType.INCREASE_ALLOWANCE: {
                topText =
                    translate('App.labels.increaseAllowance') +
                        ' ' +
                        translate('App.labels.for').toLowerCase() +
                        ' ' +
                        tx.additionalInfo?.tokenSymbol || tx.token.symbol;

                break;
            }
            case PosBasicActionType.CREATE_STAKE_ACCOUNT: {
                topText = translate('Transaction.creatingStakeAccount');
                middleText = amount;
                break;
            }
            case PosBasicActionType.SPLIT_STAKE: {
                topText = translate('Transaction.spliStakeAccount');
                middleText = amount;
                break;
            }
            case PosBasicActionType.LOCK: {
                topText = translate('App.labels.locking') + ' ' + amount;
                break;
            }
            case PosBasicActionType.SOLANA_STAKEACCOUNT_DELEGATE:
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
            case PosBasicActionType.STAKE:
            case PosBasicActionType.REDELEGATE: {
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
                const validatorName =
                    tx.additionalInfo?.validatorName ||
                    tx.additionalInfo?.validator?.name ||
                    tx.additionalInfo?.validatorId ||
                    tx.additionalInfo?.validator?.id;

                if (validatorName) {
                    middleText = translate('App.labels.from').toLowerCase() + ' ' + validatorName;
                }
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
            case PosBasicActionType.SOLANA_CREATE_ASSOCIATED_TOKEN_ACCOUNT: {
                topText = `${translate('App.labels.activate')} ${tx.additionalInfo.tokenSymbol}`;
                middleText = '0.00203928 SOL used for rent';
                break;
            }
            default: {
                middleText = '';
                topText = amount;
            }
        }

        if (tx.additionalInfo?.swap) {
            middleText = '';

            switch (tx.additionalInfo?.swap.contractMethod) {
                case ContractMethod.INCREASE_ALLOWANCE:
                    topText =
                        translate('App.labels.increaseAllowance') +
                        ' ' +
                        translate('App.labels.for').toLowerCase() +
                        ' ' +
                        tx.additionalInfo?.swap.fromTokenSymbol;

                    break;

                case ContractMethod.SWAP:
                case ContractMethod.SWAP_EXACT_ZIL_FOR_TOKENS:
                case ContractMethod.SWAP_EXACT_TOKENS_FOR_ZIL:
                case ContractMethod.SWAP_EXACT_TOKENS_FOR_TOKENS:
                    topText =
                        translate('App.labels.swap') +
                        ' ' +
                        tx.additionalInfo?.swap.fromTokenAmount +
                        ' ' +
                        tx.additionalInfo?.swap.fromTokenSymbol;

                    middleText =
                        translate('App.labels.to').toLowerCase() +
                        ' ' +
                        tx.additionalInfo?.swap.toTokenAmount +
                        ' ' +
                        tx.additionalInfo?.swap.toTokenSymbol;

                    break;
            }
        }

        return { topText, middleText, bottomText: fees || bottomText };
    }

    private startIconSpin() {
        Animated.loop(
            Animated.timing(this.iconSpinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: false
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

        let confirmationsPercent = 0;
        if (tx?.confirmations) {
            const { numConfirmations, numConfirmationsNeeded } = tx.confirmations;
            if (numConfirmations > 0 && numConfirmationsNeeded > 0) {
                confirmationsPercent = Number(
                    new BigNumber(numConfirmations)
                        .multipliedBy(100)
                        .dividedBy(new BigNumber(numConfirmationsNeeded))
                        .toFixed(0)
                );
            }
        }

        return (
            <View
                key={index + '-view-key'}
                style={styles.cardContainer}
                onLayout={event =>
                    !this.state.cardHeight &&
                    this.setState({
                        cardHeight: event.nativeEvent.layout.height + BASE_DIMENSION * 4
                    })
                }
            >
                <View style={{ flexDirection: 'row' }}>
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
                        {middleText !== '' && (
                            <Text style={[isSwapTx(tx) ? styles.topText : styles.middleText]}>
                                {middleText}
                            </Text>
                        )}
                        {bottomText !== '' && (
                            <Text style={styles.bottomText}>
                                {translate('App.labels.maxBlockchainFees') + ': ' + bottomText}
                            </Text>
                        )}
                    </View>

                    {isPublished ? (
                        status === TransactionStatus.PENDING ? (
                            <View>
                                <LoadingIndicator />
                            </View>
                        ) : status === TransactionStatus.SUCCESS ? (
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

                {tx?.confirmations && (
                    <View style={styles.confirmationsContainer}>
                        <View style={styles.confirmationsTextContainer}>
                            <PercentageCircle radius={normalize(30)} percent={confirmationsPercent}>
                                <Text style={styles.confirmationsText}>
                                    {`${tx.confirmations.numConfirmations}/${tx.confirmations.numConfirmationsNeeded}`}
                                </Text>
                            </PercentageCircle>
                        </View>

                        <Text style={styles.confirmationsDetails}>
                            {translate('App.labels.txWaitConfirmations', {
                                blocks: tx.confirmations.numConfirmationsNeeded
                            })}
                        </Text>
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
                // const blockchainInstance = getBlockchain(this.props.transactions[0].blockchain);
                // const token: ITokenState = this.props.selectedAccount.tokens[this.props.chainId][
                //     this.props.transactions[0].token.symbol
                // ];
                NavigationService.popToTop();
                NavigationService.navigate('TransactonsHistory', {});
                // NavigationService.navigate('Token', {
                //     blockchain: this.props.selectedAccount.blockchain,
                //     accountIndex: this.props.selectedAccount.index,
                //     token,
                //     activeTab: blockchainInstance.config.ui?.token?.labels?.tabTransactions,
                //     accountName:
                //         this.props.selectedAccount?.name ||
                //         `${translate('App.labels.account')} ${this.props.selectedAccount.index + 1}`
                // });
            }
        }

        this.props.closeProcessTransactions();
    }

    @bind
    private onPressSignTransaction() {
        if (this.state.insufficientFundsFees) {
            const account = this.props.selectedAccount;
            const blockchain = account.blockchain;

            const blockchainInstance = getBlockchain(blockchain);
            const nativeCoin = blockchainInstance.config.coin;

            Dialog.alert(
                translate('Validator.notEnoughTokensFees4'),
                translate('Validator.notEnoughTokensFees5'),
                {
                    text: translate('App.labels.topUp'),
                    onPress: () => {
                        const token: ITokenState = this.props.selectedAccount.tokens[
                            this.props.chainId
                        ][nativeCoin];

                        this.props.closeProcessTransactions();
                        NavigationService.popToTop();

                        NavigationService.navigate('Receive', {
                            accountIndex: account.index,
                            blockchain,
                            token
                        });
                    }
                },
                {
                    text: translate('App.labels.sign'),
                    onPress: () => {
                        this.props.signAndSendTransactions(this.props.currentTxIndex + 1);
                    }
                }
            );
        } else {
            this.props.signAndSendTransactions(this.props.currentTxIndex + 1);
        }
    }

    @bind
    private signAllTransactions() {
        const account = this.props.selectedAccount;
        const blockchain = account.blockchain;

        const blockchainInstance = getBlockchain(blockchain);
        const nativeCoin = blockchainInstance.config.coin;

        if (this.state.insufficientFundsFees) {
            Dialog.alert(
                translate('Validator.notEnoughTokensFees4'),
                translate('Validator.notEnoughTokensFees5'),
                {
                    text: translate('App.labels.topUp'),
                    onPress: () => {
                        const token: ITokenState = this.props.selectedAccount.tokens[
                            this.props.chainId
                        ][nativeCoin];

                        this.props.closeProcessTransactions();
                        NavigationService.popToTop();

                        NavigationService.navigate('Receive', {
                            accountIndex: account.index,
                            blockchain,
                            token
                        });
                    }
                },
                {
                    text: translate('App.labels.sign'),
                    onPress: () => {
                        // sign all transactions - HD wallet
                        this.props.signAndSendTransactions();
                    }
                }
            );
        } else if (this.state.warningFeesToHigh) {
            const tokenConfig = getTokenConfig(blockchain, this.props.transactions[0].token.symbol);

            Dialog.alert(
                translate('Validator.stakeAmtLow'),
                translate('Validator.stakeAmtLowDetails', {
                    token: tokenConfig.symbol
                }),
                {
                    text: translate('App.labels.cancel'),
                    onPress: () => {
                        //
                    }
                },
                {
                    text: translate('App.labels.sign'),
                    onPress: () => {
                        // sign all transactions - HD wallet
                        this.props.signAndSendTransactions();
                    }
                }
            );
        } else {
            // sign all transactions - HD wallet
            this.props.signAndSendTransactions();
        }
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
            else if (this.props.currentTxIndex + 2 <= this.props.transactions.length) {
                return (
                    <Button
                        primary
                        onPress={() => this.onPressSignTransaction()} // this.props.transactions[this.props.currentTxIndex]
                        wrapperStyle={styles.continueButton}
                    >
                        {translate(
                            'ProcessTransactions.ledgerSignButton',
                            {
                                txNumber: this.props.currentTxIndex + 2
                            },
                            this.props.currentTxIndex + 2
                        )}
                    </Button>
                );
            } else {
                return null;
            }
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

    private getScreenKey(props: IReduxProps) {
        return getScreenDataKey({
            pubKey: props?.selectedWallet?.walletPublicKey,
            blockchain: props?.selectedAccount?.blockchain,
            chainId: String(props.chainId),
            address: props.selectedAccount?.address,
            step: null,
            tab: null
        });
    }

    private getScreenData(props: IReduxProps): IScreenData {
        const screenKey = this.getScreenKey(props);
        return props.screenData && screenKey && props.screenData[screenKey];
    }

    private renderWidgets(widgets: IScreenWidget[], validation?: IScreenValidation) {
        return (
            <Widgets
                data={widgets}
                context={this.state.context}
                screenKey={this.getScreenKey(this.props)}
                actions={{
                    handleCta: this.props.handleCta,
                    clearScreenInputData: this.props.clearScreenInputData,
                    runScreenValidation: this.props.runScreenValidation,
                    runScreenStateActions: this.props.runScreenStateActions,
                    setScreenInputData: this.props.setScreenInputData
                }}
                blockchain={this.props?.selectedAccount?.blockchain}
                validation={validation}
                pubSub={null}
            />
        );
    }

    public render() {
        const { styles, theme } = this.props;
        const blockchain = this.props.selectedAccount?.blockchain;

        let title: any = (
            <React.Fragment>
                <Text style={styles.title}>{translate('Transaction.processTitleText')}</Text>
                <Text style={[styles.title, { color: theme.colors.positive }]}>
                    {translate('Transaction.processTitleText2')}
                </Text>
            </React.Fragment>
        );

        if (this.state.insufficientFundsFees) {
            // fees are always paid in native token
            // const nativeCoin = getBlockchain(this.props.selectedAccount.blockchain).config.coin;

            title = (
                <React.Fragment>
                    <Text style={styles.errorFundsTitle}>
                        {translate('Validator.notEnoughTokensFees1')}
                    </Text>
                    <Text style={[styles.errorFundsTitle, { color: theme.colors.textSecondary }]}>
                        {' ' + translate('Validator.notEnoughTokensFees2')}
                    </Text>
                    <Text style={styles.errorFundsTitle}>
                        {' ' + translate('Validator.notEnoughTokensFees3')}
                    </Text>
                </React.Fragment>
            );
        } else if (this.state.warningFeesToHigh) {
            if (
                blockchain === Blockchain.ETHEREUM &&
                this.props.transactions[0] &&
                this.props.transactions[0].token.symbol
            ) {
                const tokenConfig = getTokenConfig(
                    blockchain,
                    this.props.transactions[0].token.symbol
                );

                title = (
                    <React.Fragment>
                        <Text style={styles.title}>
                            {translate('Transaction.processTitleTextHighFees', {
                                blockchain: Capitalize(blockchain),
                                token: tokenConfig.symbol
                            })}
                        </Text>
                        <Text style={[styles.title, { color: theme.colors.error }]}>
                            {' ' + translate('Transaction.processTitleText3')}
                        </Text>
                        <Text style={[styles.title, { color: theme.colors.positive }]}>
                            {' ' + translate('Transaction.processTitleText2')}
                        </Text>
                    </React.Fragment>
                );
            } else {
                title = translate('Validator.warningFeesToHigh');
            }
        }

        if (this.props.isVisible) {
            const screenData = this.getScreenData(this.props);

            return (
                <SafeAreaProvider style={styles.container}>
                    <SafeAreaView style={styles.container}>
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

                        <Text
                            style={
                                this.state.insufficientFundsFees
                                    ? styles.errorFundsTitle
                                    : this.state.warningFeesToHigh
                                    ? styles.warningFeesTitle
                                    : styles.title
                            }
                        >
                            {title}
                        </Text>

                        {this.props.transactions.length ? (
                            <ScrollView
                                ref={ref => (this.scrollViewRef = ref)}
                                contentContainerStyle={styles.contentScrollView}
                                onLayout={event =>
                                    this.setState({
                                        txContainerHeight: event.nativeEvent.layout.height
                                    })
                                }
                            >
                                {screenData?.response?.widgets &&
                                    this.renderWidgets(
                                        screenData.response.widgets,
                                        screenData.response?.validation
                                    )}

                                {this.props.transactions.map((tx, index) =>
                                    this.renderCard(tx, index)
                                )}
                            </ScrollView>
                        ) : (
                            <LoadingIndicator />
                        )}

                        {this.renderBottomButton()}
                    </SafeAreaView>
                </SafeAreaProvider>
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
