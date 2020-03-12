import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Icon } from '../../components/icon';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Button } from '../../library/button/button';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { QrModalReader } from '../../components/qr-modal/qr-modal';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { addContact } from '../../redux/contacts/actions';
import { IContactState, IContactsState } from '../../redux/contacts/state';
import { getContacts } from '../../redux/contacts/selectors';
import { AccountList } from './components/account-list/account-list';
import { AddressBook } from './components/address-book/address-book';
import { sendTransferTransaction } from '../../redux/wallets/actions';
import {
    getAccounts,
    getAccount,
    getSelectedAccount,
    getSelectedWallet
} from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import {
    Blockchain,
    IFeeOptions,
    ResolveTextCode,
    ResolveTextError,
    ChainIdType,
    ResolveTextType
} from '../../core/blockchain/types';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { FeeOptions } from './components/fee-options/fee-options';
import BigNumber from 'bignumber.js';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { ICON_SIZE, BASE_DIMENSION } from '../../styles/dimensions';
import { ITokenConfig } from '../../core/blockchain/types/token';
import { WalletConnectWeb } from '../../core/wallet-connect/wallet-connect-web';
import { IAccountState } from '../../redux/wallets/state';
import { formatNumber } from '../../core/utils/format-number';
import { Dialog } from '../../components/dialog/dialog';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import {
    IBottomSheetExtensionRequestData,
    IExtensionRequestType,
    BottomSheetType
} from '../../redux/ui/bottomSheet/state';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { getChainId } from '../../redux/preferences/selectors';
import { Memo } from './components/extra-fields/memo/memo';
import { HeaderStepByStep } from './components/header-step-by-step/header-step-by-step';
import { EnterAmount } from './components/enter-amount/enter-amount';
import { Amount } from '../../components/amount/amount';

export interface IReduxProps {
    account: IAccountState;
    accounts: IAccountState[];
    sendTransferTransaction: typeof sendTransferTransaction;
    addContact: typeof addContact;
    contacts: IContactsState[];
    openBottomSheet: typeof openBottomSheet;
    selectedWalletId: string;
    selectedAccount: IAccountState;
    chainId: ChainIdType;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        accounts: getAccounts(state, ownProps.blockchain),
        contacts: getContacts(state),
        selectedWalletId: getSelectedWallet(state).id,
        selectedAccount: getSelectedAccount(state),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    sendTransferTransaction,
    openBottomSheet,
    addContact
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenConfig;
}

interface IState {
    toAddress: string;
    amount: string;
    isValidText: boolean;
    errorResponseText: string;
    warningResponseText: string;
    showOwnAccounts: boolean;
    insufficientFunds: boolean;
    feeOptions: IFeeOptions;
    showExtensionMessage: boolean;
    memo: string;
    isStep2: boolean;
    isStep3: boolean;
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
    public qrCodeScanner: any;
    public passwordModal = null;

    constructor(
        props: INavigationProps<INavigationParams> &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            toAddress: '',
            amount: '',
            isValidText: false,
            errorResponseText: undefined,
            warningResponseText: undefined,
            insufficientFunds: false,
            showOwnAccounts: false,
            feeOptions: undefined,
            showExtensionMessage: false,
            memo: '',
            isStep2: false,
            isStep3: false
        };
    }

    public async confirmPayment() {
        if (Platform.OS === 'web') {
            const formattedAmount = formatNumber(new BigNumber(this.state.amount), {
                currency: getBlockchain(this.props.account.blockchain).config.coin
            });

            const data: IBottomSheetExtensionRequestData = {
                type: IExtensionRequestType.SIGN_TRANSACTION,
                state: 'pending',
                mainText: `${formattedAmount} to ${formatAddress(
                    this.props.account.address,
                    this.props.account.blockchain
                )}`,
                secondaryText: new Date().toLocaleDateString('en-GB')
            };
            this.props.openBottomSheet(BottomSheetType.EXTENSION_REQUEST, { data });

            WalletConnectWeb.signTransaction({
                account: this.props.account,
                toAddress: this.state.toAddress,
                amount: this.state.amount,
                token: this.props.token,
                feeOptions: this.state.feeOptions,
                walletId: this.props.selectedWalletId,
                selectedAccount: this.props.selectedAccount
            })
                .then(() => {
                    data.state = 'completed';
                    this.props.openBottomSheet(BottomSheetType.EXTENSION_REQUEST, { data });
                    this.props.navigation.goBack();
                })
                .catch(() => {
                    data.state = 'rejected';
                    this.props.openBottomSheet(BottomSheetType.EXTENSION_REQUEST, { data });
                });
            return;
        }

        this.passwordModal.requestPassword().then(password => {
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
        });
    }

    public async onPressQrCodeIcon() {
        this.qrCodeScanner.open();
    }

    public async verifyInputText(text: string) {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        this.setState({ toAddress: text });

        try {
            const response = await blockchainInstance
                .getClient(this.props.chainId)
                .nameService.resolveText(text);

            switch (response.code) {
                case ResolveTextCode.OK: {
                    if (response.type === ResolveTextType.ADDRESS) {
                        this.setState({
                            isValidText: true,
                            errorResponseText: undefined,
                            warningResponseText: undefined
                        });
                    } else if (response.type === ResolveTextType.NAME) {
                        this.setState({
                            isValidText: false,
                            errorResponseText: undefined,
                            warningResponseText: undefined
                        });
                    }

                    break;
                }
                case ResolveTextCode.WARN_CHECKSUM: {
                    this.setState({
                        isValidText: true,
                        errorResponseText: undefined,
                        warningResponseText: translate('Send.receipientWarning')
                    });
                    break;
                }
                default:
                    {
                        this.setState({
                            isValidText: false,
                            errorResponseText: translate('Send.recipientNotValid'),
                            warningResponseText: undefined
                        });
                    }
                    break;
            }
        } catch (error) {
            switch (error.error) {
                case ResolveTextError.INVALID: {
                    this.setState({
                        isValidText: false,
                        errorResponseText: translate('Send.recipientNotValid'),
                        warningResponseText: undefined
                    });
                    break;
                }
                case ResolveTextError.CONNECTION_ERROR: {
                    this.setState({
                        isValidText: false,
                        errorResponseText: translate('Send.genericError'),
                        warningResponseText: undefined
                    });
                    break;
                }
                default: {
                    this.setState({
                        isValidText: false,
                        errorResponseText: translate('Send.recipientNotValid'),
                        warningResponseText: undefined
                    });
                    break;
                }
            }
        }
    }
    public onQrCodeScanned(value: string) {
        this.verifyInputText(value);
    }

    public onTransferBetweenAccounts() {
        const currentState = this.state.showOwnAccounts;
        this.setState({
            showOwnAccounts: !currentState,
            isValidText: false,
            toAddress: ''
        });
    }

    public onAccountSelection(account: IAccountState) {
        this.setState({ toAddress: account.address });
        this.verifyInputText(account.address);
    }

    public onContactSelected(contact: IContactState) {
        this.setState({ toAddress: contact.address });
        this.verifyInputText(contact.address);
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

    public onAddBalance(tokenBalanceValue: BigNumber) {
        const balance = tokenBalanceValue.minus(this.state.feeOptions?.feeTotal);

        if (balance.isGreaterThanOrEqualTo(0)) {
            const blockchainInstance = getBlockchain(this.props.account.blockchain);
            const amountFromStd = blockchainInstance.account.amountFromStd(new BigNumber(balance));
            this.setState({ amount: amountFromStd.toString() }, () => this.availableFunds());
        }
    }

    public onAddAllBalance() {
        const token = this.props.account.tokens[this.props.token.symbol];
        const tokenBalanceValue = new BigNumber(token.balance?.value);

        this.onAddBalance(tokenBalanceValue);
    }

    public onAddHalfBalance() {
        const token = this.props.account.tokens[this.props.token.symbol];
        const tokenBalanceValue = new BigNumber(token.balance?.value).dividedBy(2);

        this.onAddBalance(tokenBalanceValue);
    }

    public availableFunds() {
        const feeTokenSymbol = getBlockchain(this.props.account.blockchain).config.coin;
        let completeAmount = this.getAmountToStd();
        const tokenBalanceValue = new BigNumber(this.props.token.balance?.value);
        if (this.props.token.symbol === feeTokenSymbol) {
            completeAmount = completeAmount.plus(new BigNumber(this.state.feeOptions?.feeTotal));
        }

        if (tokenBalanceValue.minus(completeAmount).isGreaterThanOrEqualTo(0)) {
            this.setState({ insufficientFunds: false });
        } else {
            this.setState({ insufficientFunds: true });
        }
    }

    public onPressClearInput() {
        this.setState({
            isValidText: false,
            toAddress: '',
            errorResponseText: undefined,
            warningResponseText: undefined
        });
    }

    public renderRightAddressIcon() {
        const styles = this.props.styles;
        if (Platform.OS === 'web') {
            return null;
        }

        if (!this.state.isValidText) {
            return (
                <TouchableOpacity
                    testID="qrcode-icon"
                    onPress={() => this.onPressQrCodeIcon()}
                    style={styles.rightAddressButton}
                >
                    <Icon name="qr-code-scan" size={ICON_SIZE} style={styles.icon} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    testID="clear-address"
                    onPress={() => this.onPressClearInput()}
                    style={styles.rightAddressButton}
                >
                    <Icon name="close" size={16} style={styles.icon} />
                </TouchableOpacity>
            );
        }
    }

    public async alertModalAddAddress() {
        // TODO: check this, it's not opening all the time
        const inputValue = await Dialog.prompt(
            translate('Send.alertTitle'),
            translate('Send.alertDescription')
        );

        const contactData: IContactState = {
            blockchain: this.props.account.blockchain,
            name: inputValue,
            address: this.state.toAddress
        };

        if (inputValue !== '') {
            this.props.addContact(contactData);
        }
    }

    public renderAddAddressToBook() {
        const { styles } = this.props;

        const addressNotInWalletAccounts =
            this.props.accounts.filter(
                account =>
                    account.blockchain === this.props.blockchain &&
                    account.address.toLocaleLowerCase() === this.state.toAddress.toLocaleLowerCase()
            ).length === 0;

        if (
            this.state.isValidText &&
            this.props.contacts[`${this.props.blockchain}|${this.state.toAddress}`] === undefined &&
            addressNotInWalletAccounts === true
        ) {
            return (
                <TouchableOpacity onPress={() => this.alertModalAddAddress()}>
                    <Text style={styles.addressNotInBookText}>
                        {translate('Send.addressNotInBook')}
                    </Text>
                </TouchableOpacity>
            );
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

    public renderListOrBook() {
        if (this.state.showOwnAccounts) {
            return (
                <AccountList
                    accounts={this.props.accounts}
                    onAccountSelection={(account: IAccountState) =>
                        this.onAccountSelection(account)
                    }
                    selectedAddress={this.state.toAddress}
                />
            );
        } else {
            return (
                <AddressBook
                    blockchain={this.props.blockchain}
                    onContactSelected={(contact: IContactState) => this.onContactSelected(contact)}
                    selectedAddress={this.state.toAddress}
                />
            );
        }
    }

    private renderAddAddressContainer() {
        const { styles, theme, account } = this.props;

        return (
            <View style={styles.addAddressContainer}>
                <Text style={styles.receipientLabel}>
                    {this.state.toAddress !== '' ? translate('Send.recipientLabel') : ' '}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        testID="input-address"
                        style={styles.inputAddress}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Send.inputAddress')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        editable={!this.state.isValidText}
                        selectionColor={theme.colors.accent}
                        value={
                            this.state.isValidText
                                ? formatAddress(this.state.toAddress, account.blockchain)
                                : this.state.toAddress
                        }
                        onChangeText={text => this.verifyInputText(text)}
                    />
                    {this.renderRightAddressIcon()}
                </View>

                {this.state.errorResponseText && (
                    <Text style={styles.displayError}>{this.state.errorResponseText}</Text>
                )}

                {this.state.warningResponseText && (
                    <Text style={styles.receipientWarning}>{this.state.warningResponseText}</Text>
                )}

                <TouchableOpacity
                    testID="transfer-between-accounts"
                    onPress={() => this.onTransferBetweenAccounts()}
                    style={[styles.buttonRightOptions]}
                >
                    <Text style={styles.textTranferButton}>
                        {this.state.showOwnAccounts
                            ? translate('App.labels.close')
                            : translate('Send.transferOwnAccounts')}
                    </Text>
                </TouchableOpacity>

                {this.renderAddAddressToBook()}

                {this.renderListOrBook()}
            </View>
        );
    }

    private getAmountToStd(): BigNumber {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        return blockchainInstance.account.amountToStd(
            new BigNumber(this.state.amount ? this.state.amount : 0),
            this.props.token.decimals
        );
    }

    private renderBottomConfirm() {
        const { token, styles, account } = this.props;
        const { amount, isStep2, isStep3 } = this.state;
        const stdAmount = this.getAmountToStd();

        return (
            <View style={styles.bottomWrapper}>
                <View style={styles.bottomDivider} />

                <View style={styles.bottomContainer}>
                    <View style={styles.bottomTextContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.bottomSendText}>
                                {translate('App.labels.send')}
                            </Text>
                            <Text style={[styles.bottomToText, { textTransform: 'lowercase' }]}>
                                {translate('App.labels.to')}
                            </Text>
                            <Text style={styles.bottomDefaultText}>
                                {this.state.isValidText
                                    ? formatAddress(this.state.toAddress, account.blockchain)
                                    : '___...___'}
                            </Text>
                        </View>

                        {(isStep2 || isStep3) && (
                            <Text style={styles.bottomDefaultText}>
                                {amount === ''
                                    ? `_.___ ${token.symbol}`
                                    : `${amount} ${token.symbol}`}
                            </Text>
                        )}

                        {(isStep2 || isStep3) && (
                            <Amount
                                style={styles.bottomAmountText}
                                token={token.symbol}
                                tokenDecimals={token.decimals}
                                amount={stdAmount.toString()}
                                blockchain={this.props.account.blockchain}
                                convert
                            />
                        )}
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <Button
                            style={{ width: 140 }}
                            primary
                            disabled={
                                this.state.toAddress === '' ||
                                (isStep2 && (amount === '' || this.state.insufficientFunds)) ||
                                (isStep3 &&
                                    (!this.state.isValidText ||
                                        this.state.amount === '' ||
                                        this.state.insufficientFunds === true ||
                                        isNaN(Number(this.state.feeOptions?.gasLimit)) === true ||
                                        isNaN(Number(this.state.feeOptions?.gasPrice))))
                            }
                            onPress={() => {
                                if (isStep3 === true) {
                                    // confirm
                                    this.confirmPayment();
                                } else if (isStep2 === false) {
                                    // step 2
                                    this.setState({ isStep2: true, isStep3: false });
                                } else if (isStep3 === false) {
                                    // step 3
                                    this.setState({ isStep2: false, isStep3: true });
                                }
                            }}
                        >
                            {this.state.isStep3
                                ? translate('App.labels.confirm')
                                : translate('App.labels.next')}
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    private renderEnterAmount() {
        const config = getBlockchain(this.props.account.blockchain).config;

        return (
            <View style={this.props.styles.amountContainer}>
                <EnterAmount
                    amount={this.state.amount}
                    insufficientFunds={this.state.insufficientFunds}
                    token={this.props.token}
                    blockchain={this.props.account.blockchain}
                    onInputEnter={amount => this.addAmount(amount)}
                    onAddAmount={amount => {
                        let amountState = this.state.amount;
                        if (amountState === '') amountState = '0';

                        const value = new BigNumber(amountState).plus(new BigNumber(amount));
                        this.addAmount(value.toString());
                    }}
                    onAddAllBalance={() => this.onAddAllBalance()}
                    onAddHalfBalance={() => this.onAddHalfBalance()}
                />
                <FeeOptions
                    token={this.props.account.tokens[config.coin]}
                    sendingToken={this.props.token}
                    account={this.props.account}
                    toAddress={this.state.toAddress}
                    onFeesChanged={(feeOptions: IFeeOptions) => this.onFeesChanged(feeOptions)}
                />
            </View>
        );
    }

    private renderConfirmTransaction() {
        const { styles } = this.props;
        const extraFields = getBlockchain(this.props.account.blockchain).config.ui.extraFields;

        return (
            <View style={styles.confirmTransactionContainer}>
                <Text style={styles.receipientLabel}>{translate('Send.recipientLabel')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>
                        {formatAddress(this.state.toAddress, this.props.account.blockchain)}
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
                        token={this.props.token.symbol}
                        tokenDecimals={this.props.token.decimals}
                        amount={this.state.feeOptions?.feeTotal}
                        blockchain={this.props.account.blockchain}
                    />
                </View>

                {extraFields && extraFields.map(value => this.renderExtraFields(value))}
            </View>
        );
    }

    public render() {
        const { styles } = this.props;
        const { isStep2, isStep3 } = this.state;

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <View style={styles.content}>
                    <HeaderStepByStep
                        steps={[
                            { title: translate('Send.addAddress') },
                            {
                                title: translate('Send.enterAmount'),
                                selected: this.state.isStep2
                            },
                            {
                                title: translate('Send.confirmTransaction'),
                                selected: this.state.isStep3
                            }
                        ]}
                        selectPreviousStep={(index: number) => {
                            if (index === 1 && isStep3) {
                                this.setState({ isStep2: true, isStep3: false });
                            } else if (index === 0) {
                                this.setState({ isStep2: false, isStep3: false });
                            }
                        }}
                    />
                    {!isStep2 && !isStep3 && this.renderAddAddressContainer()}
                    {isStep2 && this.renderEnterAmount()}
                    {isStep3 && this.renderConfirmTransaction()}
                    {this.renderBottomConfirm()}
                </View>

                <PasswordModal obRef={ref => (this.passwordModal = ref)} />

                <QrModalReader
                    ref={ref => (this.qrCodeScanner = ref)}
                    onQrCodeScanned={value => this.onQrCodeScanned(value)}
                />
            </View>
        );
    }
}

export const SendScreen = smartConnect(SendScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
