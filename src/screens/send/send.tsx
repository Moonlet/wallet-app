import React from 'react';
import { View, Platform } from 'react-native';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text, Button } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { sendTransferTransaction, addPublishedTxToAccount } from '../../redux/wallets/actions';
import { getAccount, getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import {
    Blockchain,
    IFeeOptions,
    ChainIdType,
    TransactionMessageText,
    TransactionMessageType,
    IBlockchainTransaction
} from '../../core/blockchain/types';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { FeeOptions } from './components/fee-options/fee-options';
import BigNumber from 'bignumber.js';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { IAccountState, ITokenState, IWalletState } from '../../redux/wallets/state';
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
import { NotificationType } from '../../core/messaging/types';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { NavigationService } from '../../navigation/navigation-service';
import { LoadingModal } from '../../components/loading-modal/loading-modal';
import { BottomCta } from '../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../components/bottom-cta/amount-cta-field/amount-cta-field';
import {
    getInputAmountToStd,
    availableFunds,
    availableAmount
} from '../../core/utils/available-funds';

interface IHeaderStep {
    step: number;
    title: string;
    active: boolean;
}

export interface IReduxProps {
    account: IAccountState;
    sendTransferTransaction: typeof sendTransferTransaction;
    openBottomSheet: typeof openBottomSheet;
    selectedWallet: IWalletState;
    selectedAccount: IAccountState;
    chainId: ChainIdType;
    addPublishedTxToAccount: typeof addPublishedTxToAccount;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        selectedWallet: getSelectedWallet(state),
        selectedAccount: getSelectedAccount(state),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    sendTransferTransaction,
    openBottomSheet,
    addPublishedTxToAccount
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
            await LoadingModal.open({
                text: TransactionMessageText.WAITING_TX_CONFIRM,
                type: TransactionMessageType.INFO
            });

            const formattedAmount = formatNumber(new BigNumber(this.state.amount), {
                currency: getBlockchain(this.props.account.blockchain).config.coin
            });

            const formattedAddress = formatAddress(
                this.props.account.address,
                this.props.account.blockchain
            );

            const account = this.props.account;
            const token = this.props.token;

            const moonletTransferPayload: any = {
                account,
                toAddress: this.state.toAddress,
                amount: this.state.amount,
                token: token.symbol,
                feeOptions: this.state.feeOptions,
                extraFields: { memo: this.state.memo },
                walletId: this.props.selectedWallet.id // extra data needed for Tx Request Screen
            };

            // add type to this
            const sendRequestPayload = {
                method: NotificationType.MOONLET_TRANSFER,
                params: [moonletTransferPayload],
                notification: {
                    title: translate('Notifications.extensionTx.title'),
                    body: translate('Notifications.extensionTx.body', {
                        formattedAmount,
                        formattedAddress
                    })
                }
            };

            try {
                const sendRequestRes = await ConnectExtension.sendRequest(sendRequestPayload);

                if (sendRequestRes?.success) {
                    await LoadingModal.open({
                        type: TransactionMessageType.COMPONENT,
                        component: (
                            <View style={this.props.styles.loadingModalContainer}>
                                <Text style={this.props.styles.loadingModalMessage}>
                                    {translate(
                                        'LoadingModal.' +
                                            TransactionMessageText.WAITING_TX_CONFIRM_CANCEL,
                                        { app: this.props.blockchain }
                                    )}
                                </Text>
                                <Button
                                    onPress={async () => {
                                        await LoadingModal.close();

                                        try {
                                            await ConnectExtension.deleteRequest(
                                                sendRequestRes.data.requestId
                                            );
                                        } catch {
                                            //
                                        }
                                    }}
                                >
                                    {translate('App.labels.cancel')}
                                </Button>
                            </View>
                        )
                    });

                    ConnectExtensionWeb.listenerReqResponse(
                        sendRequestRes.data.requestId,
                        async (res: {
                            result: { txHash: string; tx: IBlockchainTransaction };
                            errorCode: string;
                        }) => {
                            if (res.errorCode) {
                                await LoadingModal.close();
                            } else if (res.result?.txHash && res.result?.tx) {
                                this.props.addPublishedTxToAccount(
                                    res.result.txHash,
                                    res.result.tx,
                                    this.props.selectedWallet.id
                                );

                                await LoadingModal.close();
                                NavigationService.goBack();
                            } else {
                                // error
                            }
                        }
                    );
                }
            } catch {
                // show error message to the user
                await LoadingModal.close();
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
        this.setState({ feeOptions }, () => {
            const { insufficientFunds, insufficientFundsFees } = availableFunds(
                this.state.amount,
                this.props.account,
                this.props.token,
                this.props.chainId,
                feeOptions
            );

            this.setState({ insufficientFunds, insufficientFundsFees });
        });
    }

    public onMemoInput(memo: string) {
        this.setState({ memo });
    }

    public addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        this.setState({ amount }, () => {
            const { insufficientFunds, insufficientFundsFees } = availableFunds(
                amount,
                this.props.account,
                this.props.token,
                this.props.chainId,
                this.state.feeOptions
            );

            this.setState({ insufficientFunds, insufficientFundsFees });
        });
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

    private renderBottomConfirm() {
        const activeIndex = _.findIndex(this.state.headerSteps, ['active', true]);
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        let disableButton: boolean;
        switch (activeIndex) {
            case 0:
                // Add address
                if (this.state.toAddress === '') disableButton = true;
                break;
            case 1:
                // Enter amount
                if (
                    this.state.amount === '' ||
                    this.state.insufficientFunds ||
                    this.state.insufficientFundsFees ||
                    isNaN(Number(this.state.feeOptions?.gasLimit)) === true ||
                    isNaN(Number(this.state.feeOptions?.gasPrice))
                )
                    disableButton = true;
                break;
            case 2:
                // Confirm transaction
                disableButton = false;
                break;
            default:
                disableButton = true;
                break;
        }

        return (
            <BottomCta
                label={
                    activeIndex === this.state.headerSteps.length - 1
                        ? translate('App.labels.confirm')
                        : translate('App.labels.next')
                }
                disabled={disableButton}
                onPress={() => {
                    if (activeIndex === 2) {
                        this.confirmPayment();
                    } else {
                        const steps = this.state.headerSteps;

                        steps[activeIndex].active = false;
                        steps[activeIndex + 1].active = true;

                        this.setState({ headerSteps: steps });
                    }
                }}
            >
                <PrimaryCtaField
                    label={translate('App.labels.send')}
                    action={translate('App.labels.to')}
                    value={formatAddress(this.state.toAddress, this.props.account.blockchain)}
                />
                {(activeIndex === 1 || activeIndex === 2) && (
                    <AmountCtaField
                        tokenConfig={tokenConfig}
                        stdAmount={getInputAmountToStd(
                            this.props.account,
                            this.props.token,
                            this.state.amount
                        )}
                        account={this.props.account}
                    />
                )}
            </BottomCta>
        );
    }

    private renderEnterAmount() {
        const config = getBlockchain(this.props.account.blockchain).config;

        return (
            <View key="enterAmount" style={this.props.styles.amountContainer}>
                <EnterAmount
                    availableAmount={availableAmount(
                        this.props.account,
                        this.props.token,
                        this.state.feeOptions
                    )}
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
