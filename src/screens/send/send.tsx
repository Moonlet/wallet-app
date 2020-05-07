import React from 'react';
import { View, Platform } from 'react-native';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { sendTransferTransaction } from '../../redux/wallets/actions';
import { getAccount, getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import {
    Blockchain,
    IFeeOptions,
    ChainIdType,
    TransactionMessageText,
    TransactionMessageType
} from '../../core/blockchain/types';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { FeeOptions } from './components/fee-options/fee-options';
import BigNumber from 'bignumber.js';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { TokenType } from '../../core/blockchain/types/token';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { formatNumber } from '../../core/utils/format-number';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { getChainId } from '../../redux/preferences/selectors';
import { Memo } from './components/extra-fields/memo/memo';
import { HeaderStepByStep } from './components/header-step-by-step/header-step-by-step';
import { EnterAmount } from './components/enter-amount/enter-amount';
import { Amount } from '../../components/amount/amount';
import _ from 'lodash';
import { AddAddress } from './components/add-address/add-address';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';
import {
    openLoadingModal,
    closeLoadingModal,
    displayMessage
} from '../../redux/ui/loading-modal/actions';
import { IHeaderStep, BottomConfirm } from './components/bottom-confirm/bottom-confirm';
import { NotificationType } from '../../core/messaging/types';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { NavigationService } from '../../navigation/navigation-service';

export interface IReduxProps {
    account: IAccountState;
    sendTransferTransaction: typeof sendTransferTransaction;
    openBottomSheet: typeof openBottomSheet;
    selectedWalletId: string;
    selectedWalletNane: string;
    selectedAccount: IAccountState;
    chainId: ChainIdType;
    openLoadingModal: typeof openLoadingModal;
    closeLoadingModal: typeof closeLoadingModal;
    displayMessage: typeof displayMessage;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        selectedWalletId: getSelectedWallet(state).id,
        selectedWalletNane: getSelectedWallet(state).name,
        selectedAccount: getSelectedAccount(state),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    sendTransferTransaction,
    openBottomSheet,
    openLoadingModal,
    closeLoadingModal,
    displayMessage
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
}

interface IState {
    toAddress: string;
    amount: string;
    insufficientFunds: boolean;
    feeOptions: IFeeOptions;
    showExtensionMessage: boolean;
    memo: string;
    headerSteps: IHeaderStep[];
    insufficientFundsFees: boolean;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('App.labels.send')
});
export class SendScreenComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            toAddress: '',
            amount: '',
            insufficientFunds: false,
            feeOptions: undefined,
            showExtensionMessage: false,
            memo: '',
            headerSteps: [
                { step: 1, title: translate('Send.addAddress'), active: true },
                { step: 2, title: translate('Send.enterAmount'), active: false },
                { step: 3, title: translate('Send.confirmTransaction'), active: false }
            ],
            insufficientFundsFees: false
        };
    }

    public async confirmPayment() {
        if (Platform.OS === 'web') {
            this.props.openLoadingModal();
            this.props.displayMessage(
                TransactionMessageText.WAITING_TX_CONFIRM,
                TransactionMessageType.INFO
            );

            const formattedAmount = formatNumber(new BigNumber(this.state.amount), {
                currency: getBlockchain(this.props.account.blockchain).config.coin
            });

            const formattedAddress = formatAddress(
                this.props.account.address,
                this.props.account.blockchain
            );

            const account = this.props.account;
            const token = this.props.token;

            const blockchainInstance = getBlockchain(account.blockchain);
            const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

            const amount = blockchainInstance.account
                .amountToStd(this.state.amount, tokenConfig.decimals)
                .toFixed();

            const tx: any = await blockchainInstance.transaction.buildTransferTransaction({
                chainId: this.props.chainId,
                account,
                toAddress: this.state.toAddress,
                amount,
                token: token.symbol,
                feeOptions: this.state.feeOptions,
                extraFields: { memo: this.state.memo }
            });

            // need account index for sign
            tx.accountIndex = account.index;
            tx.walletName = this.props.selectedWalletNane;
            tx.accountName = account?.name || `Account ${account.index + 1}`;

            // add type to this
            const sendRequestPayload = {
                method: NotificationType.MOONLET_TRANSFER,
                params: [tx],
                notification: {
                    title: translate('Notification.title'),
                    body: translate('Notification.body', {
                        formattedAmount,
                        formattedAddress
                    })
                }
            };

            try {
                const sendRequestRes = await ConnectExtension.sendRequest(sendRequestPayload);

                if (sendRequestRes?.success) {
                    ConnectExtensionWeb.listenerReqResponse(
                        sendRequestRes.data.requestId,
                        (txHash: string) => {
                            if (txHash) {
                                //
                                this.props.closeLoadingModal();
                                NavigationService.goBack();
                            } else {
                                // error
                            }
                        }
                    );
                }
            } catch {
                // show error message to the user
                this.props.closeLoadingModal();
            }

            return;
        } else {
            // Mobile App

            try {
                const password = await PasswordModal.getPassword(
                    translate('Password.pinTitleUnlock'),
                    translate('Password.subtitleSignTransaction'),
                    { sensitive: true, showCloseButton: true }
                );
                this.props.sendTransferTransaction(
                    this.props.account,
                    this.state.toAddress,
                    this.state.amount,
                    this.props.token.symbol,
                    this.state.feeOptions,
                    password,
                    this.props.navigation,
                    { memo: this.state.memo }
                );
            } catch (err) {
                //
            }
        }
    }

    public onFeesChanged(feeOptions: IFeeOptions) {
        this.setState({ feeOptions }, () => this.availableFunds());
    }

    public onMemoInput(memo: string) {
        this.setState({ memo });
    }

    public addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        this.setState({ amount }, () => this.availableFunds());
    }

    public availableAmount() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        let balance: BigNumber = new BigNumber(this.props.token.balance?.value);
        if (tokenConfig.type === TokenType.NATIVE) {
            balance = balance.minus(this.state.feeOptions?.feeTotal);
        }

        if (balance.isGreaterThanOrEqualTo(0)) {
            const blockchainInstance = getBlockchain(this.props.account.blockchain);
            const amountFromStd = blockchainInstance.account.amountFromStd(new BigNumber(balance));
            return amountFromStd.toString();
        } else {
            return new BigNumber(0).toString();
        }
    }

    public availableFunds() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        // Amount check
        const inputAmount = this.getInputAmountToStd();
        const availableAmount = new BigNumber(this.props.token.balance?.value);

        // amount > available amount
        if (inputAmount.isGreaterThan(availableAmount)) {
            this.setState({ insufficientFunds: true });
            return;
        } else {
            this.setState({ insufficientFunds: false });
        }

        // Fees check
        const feeTotal = new BigNumber(this.state.feeOptions?.feeTotal);

        if (tokenConfig.type === TokenType.NATIVE) {
            // feeTotal + amount > available amount
            if (feeTotal.plus(inputAmount).isGreaterThan(availableAmount)) {
                this.setState({ insufficientFundsFees: true });
            } else {
                this.setState({ insufficientFundsFees: false });
            }
        } else {
            const nativeCoin = getBlockchain(this.props.account.blockchain).config.coin;
            const nativeCoinBalance = this.props.account.tokens[this.props.chainId][nativeCoin]
                .balance?.value;
            const availableBalance = new BigNumber(nativeCoinBalance);

            // ERC20 / ZRC2
            // feeTotal > available amount
            if (feeTotal.isGreaterThan(availableBalance)) {
                this.setState({ insufficientFundsFees: true });
            } else {
                this.setState({ insufficientFundsFees: false });
            }
        }
    }

    public renderExtraFields(value: string) {
        switch (value) {
            case 'Memo':
                return <Memo key={value} onMemoInput={(memo: string) => this.onMemoInput(memo)} />;

            default:
                return null;
        }
    }

    private renderAddAddressContainer() {
        return (
            <AddAddress
                key="AddAddressContainer"
                account={this.props.account}
                blockchain={this.props.blockchain}
                chainId={this.props.chainId}
                onChange={(toAddress: string) => this.setState({ toAddress })}
            />
        );
    }

    private getInputAmountToStd(): BigNumber {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        return blockchainInstance.account.amountToStd(
            new BigNumber(this.state.amount ? this.state.amount : 0),
            tokenConfig.decimals
        );
    }

    private renderBottomConfirm() {
        const activeIndex = _.findIndex(this.state.headerSteps, ['active', true]);
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        return (
            <BottomConfirm
                toAddress={this.state.toAddress}
                activeIndex={activeIndex}
                amount={this.state.amount}
                account={this.props.account}
                feeOptions={this.state.feeOptions}
                insufficientFunds={this.state.insufficientFunds}
                insufficientFundsFees={this.state.insufficientFundsFees}
                headerSteps={this.state.headerSteps}
                tokenConfig={tokenConfig}
                stdAmount={this.getInputAmountToStd()}
                confirmPayment={() => this.confirmPayment()}
                setHeaderSetps={(steps: IHeaderStep[]) => this.setState({ headerSteps: steps })}
            />
        );
        //
    }

    private renderEnterAmount() {
        const config = getBlockchain(this.props.account.blockchain).config;

        return (
            <View key="enterAmount" style={this.props.styles.amountContainer}>
                <EnterAmount
                    availableAmount={this.availableAmount()}
                    value={this.state.amount}
                    insufficientFunds={this.state.insufficientFunds}
                    token={this.props.token}
                    blockchain={this.props.account.blockchain}
                    onChange={amount => this.addAmount(amount)}
                />
                <FeeOptions
                    token={this.props.account.tokens[this.props.chainId][config.coin]}
                    sendingToken={this.props.token}
                    account={this.props.account}
                    toAddress={this.state.toAddress}
                    onFeesChanged={(feeOptions: IFeeOptions) => this.onFeesChanged(feeOptions)}
                    insufficientFundsFees={this.state.insufficientFundsFees}
                />
            </View>
        );
    }

    private renderConfirmTransaction() {
        const { account, chainId, styles } = this.props;
        const { blockchain } = account;
        const config = getBlockchain(blockchain).config;
        const extraFields = config.ui.extraFields;

        const feeToken = getTokenConfig(
            account.blockchain,
            account.tokens[chainId][config.coin].symbol
        );
        const feeTokenSymbol = config.feeOptions.gasPriceToken;

        return (
            <View key="confirmTransaction" style={styles.confirmTransactionContainer}>
                <Text style={styles.receipientLabel}>{translate('Send.recipientLabel')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>
                        {formatAddress(this.state.toAddress, blockchain)}
                    </Text>
                </View>

                <Text style={styles.receipientLabel}>{translate('Send.amount')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>
                        {`${this.state.amount} ${this.props.token.symbol}`}
                    </Text>
                </View>

                <Text style={styles.receipientLabel}>{translate('App.labels.fees')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Amount
                        style={styles.confirmTransactionText}
                        token={feeTokenSymbol}
                        tokenDecimals={feeToken.decimals}
                        amount={this.state.feeOptions?.feeTotal}
                        blockchain={blockchain}
                    />
                </View>

                {extraFields && extraFields.map(value => this.renderExtraFields(value))}
            </View>
        );
    }

    public render() {
        const { styles } = this.props;
        const { headerSteps } = this.state;

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={styles.content}>
                        <HeaderStepByStep
                            steps={headerSteps}
                            selectStep={selectedIdex => {
                                const activeIndex = _.findIndex(headerSteps, ['active', true]);

                                const steps = headerSteps;
                                if (selectedIdex < activeIndex) {
                                    steps[activeIndex].active = false;
                                    steps[selectedIdex].active = true;
                                }

                                this.setState({ headerSteps: steps });
                            }}
                        />

                        {headerSteps.map((step, index) => {
                            if (step.active) {
                                switch (index) {
                                    case 0:
                                        return this.renderAddAddressContainer();
                                    case 1:
                                        return this.renderEnterAmount();
                                    case 2:
                                        return this.renderConfirmTransaction();
                                    default:
                                        return null;
                                }
                            }
                        })}
                    </View>
                </KeyboardAwareScrollView>

                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const SendScreen = smartConnect(SendScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
