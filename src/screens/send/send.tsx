import React from 'react';
import { View, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
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
import { AccountAddress } from '../../components/account-address/account-address';
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
import bind from 'bind-decorator';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { ICON_SIZE } from '../../styles/dimensions';
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
    userAction: boolean;
    memo: string;
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
            userAction: false,
            memo: ''
        };
    }

    public confirmPayment = async () => {
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
    };

    public onPressQrCodeIcon = async () => {
        this.qrCodeScanner.open();
    };

    public verifyInputText = async (text: string) => {
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
                            warningResponseText: undefined,
                            userAction: false
                        });
                    } else if (response.type === ResolveTextType.NAME) {
                        this.setState({
                            isValidText: false,
                            userAction: true,
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
    };
    public onQrCodeScanned = (value: string) => {
        this.verifyInputText(value);
    };

    public onTransferBetweenAccounts = () => {
        const currentState = this.state.showOwnAccounts;
        this.setState({
            showOwnAccounts: !currentState,
            isValidText: false,
            userAction: false,
            toAddress: ''
        });
    };

    public onAccountSelection = (account: IAccountState) => {
        this.setState({ toAddress: account.address, showOwnAccounts: false });
        this.verifyInputText(account.address);
    };

    public onContactSelected = (contact: IContactState) => {
        this.setState({ toAddress: contact.address, showOwnAccounts: false });
        this.verifyInputText(contact.address);
    };

    public onFeesChanged = (feeOptions: IFeeOptions) => {
        this.setState({ feeOptions }, () => this.availableFunds());
    };

    @bind
    public onMemoInput(memo: string) {
        this.setState({ memo });
    }

    public addAmount = (value: string) => {
        this.setState({ amount: value }, () => this.availableFunds());
    };

    public onAddAllBalance = () => {
        const token = this.props.account.tokens[this.props.token.symbol];
        const tokenBalanceValue = new BigNumber(token.balance?.value);

        const allBalance = tokenBalanceValue.minus(this.state.feeOptions.feeTotal);

        if (allBalance.isGreaterThanOrEqualTo(0)) {
            const blockchainInstance = getBlockchain(this.props.account.blockchain);
            const amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(allBalance)
            );
            this.setState({ amount: amountFromStd.toString() }, () => this.availableFunds());
        }
    };

    public availableFunds() {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const stdAmount = blockchainInstance.account.amountToStd(
            new BigNumber(this.state.amount ? this.state.amount : 0),
            this.props.token.decimals
        );

        const feeTokenSymbol = getBlockchain(this.props.account.blockchain).config.coin;
        const completeAmount = stdAmount;
        const tokenBalanceValue = new BigNumber(this.props.token.balance?.value);
        if (this.props.token.symbol === feeTokenSymbol) {
            completeAmount.plus(new BigNumber(this.state.feeOptions.feeTotal));
        }

        if (tokenBalanceValue.minus(completeAmount).isGreaterThanOrEqualTo(0)) {
            this.setState({ insufficientFunds: false });
        } else {
            this.setState({ insufficientFunds: true });
        }
    }

    @bind
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
                    onPress={this.onPressQrCodeIcon}
                    style={[styles.rightAddressButton]}
                >
                    <Icon name="qr-code-scan" size={ICON_SIZE} style={styles.icon} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    testID="clear-address"
                    onPress={this.onPressClearInput}
                    style={[styles.rightAddressButton]}
                >
                    <Icon name="close" size={16} style={styles.icon} />
                </TouchableOpacity>
            );
        }
    }

    public alertModalAddAddress = async () => {
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
    };

    public renderAddAddressToBook() {
        const { styles } = this.props;

        const addressNotInAccounts =
            this.props.accounts.filter(
                account =>
                    account.blockchain === this.props.blockchain &&
                    account.address === this.state.toAddress
            ).length === 0;

        if (
            this.state.isValidText &&
            this.props.contacts[`${this.props.blockchain}|${this.state.toAddress}`] === undefined &&
            addressNotInAccounts === true
        ) {
            return (
                <TouchableOpacity onPress={this.alertModalAddAddress}>
                    <Text style={styles.addressNotInBookText}>
                        {translate('Send.addressNotInBook')}
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    public renderContinueAction() {
        const styles = this.props.styles;
        return (
            <View style={styles.userActionContainer}>
                <Button
                    primary
                    style={styles.userActionButton}
                    onPress={() => {
                        this.setState({ isValidText: true, userAction: false });
                    }}
                >
                    {translate('App.labels.continue')}
                </Button>
            </View>
        );
    }

    public renderExtraFields(value: string) {
        switch (value) {
            case 'Memo':
                return <Memo onMemoInput={this.onMemoInput} />;

            default:
                return null;
        }
    }

    public renderBasicFields() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        const extraFields = getBlockchain(this.props.account.blockchain).config.ui.extraFields;

        return (
            <View style={styles.basicFields}>
                <Text style={styles.receipientLabel}>
                    {this.state.amount !== '' ? translate('Send.amount') : ' '}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        testID="amount"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Send.amount')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.amount}
                        onChangeText={value => this.addAmount(value)}
                        keyboardType="decimal-pad"
                    />
                </View>
                {this.state.insufficientFunds && (
                    <Text style={styles.displayError}>{translate('Send.insufficientFunds')}</Text>
                )}
                <TouchableOpacity
                    testID="all-balance"
                    onPress={this.onAddAllBalance}
                    style={[styles.buttonRightOptions]}
                >
                    <Text style={styles.textTranferButton}>{translate('Send.allBalance')}</Text>
                </TouchableOpacity>

                {extraFields && extraFields.map(value => this.renderExtraFields(value))}

                <FeeOptions
                    token={
                        this.props.account.tokens[
                            getBlockchain(this.props.account.blockchain).config.coin
                        ]
                    }
                    sendingToken={this.props.token}
                    account={this.props.account}
                    toAddress={this.state.toAddress}
                    onFeesChanged={this.onFeesChanged}
                />

                <View style={styles.bottom}>
                    <Button
                        testID="confirm-payment"
                        style={styles.bottomButton}
                        primary
                        disabled={
                            !this.state.isValidText ||
                            this.state.amount === '' ||
                            this.state.insufficientFunds === true ||
                            isNaN(Number(this.state.feeOptions?.gasLimit)) === true ||
                            isNaN(Number(this.state.feeOptions?.gasPrice))
                        }
                        onPress={this.confirmPayment}
                    >
                        {translate('App.labels.confirmPayment')}
                    </Button>
                </View>
            </View>
        );
    }

    public renderListOrBook() {
        if (this.state.showOwnAccounts) {
            return (
                <AccountList
                    accounts={this.props.accounts}
                    onAccountSelection={this.onAccountSelection}
                />
            );
        } else {
            return (
                <AddressBook
                    blockchain={this.props.blockchain}
                    onContactSelected={this.onContactSelected}
                />
            );
        }
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        const account = this.props.account;

        return (
            <View style={styles.container}>
                <TestnetBadge />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.accountAddress}>
                        <AccountAddress account={account} token={this.props.token} />
                    </View>
                    <Text style={styles.receipientLabel}>
                        {this.state.toAddress !== '' ? translate('Send.recipientLabel') : ' '}
                    </Text>
                    <View style={styles.inputBoxAddress}>
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
                            onChangeText={text => {
                                this.verifyInputText(text);
                            }}
                        />
                        {this.renderRightAddressIcon()}
                    </View>
                    {this.state.errorResponseText && (
                        <Text style={styles.displayError}>{this.state.errorResponseText}</Text>
                    )}
                    {this.state.warningResponseText && (
                        <Text style={styles.receipientWarning}>
                            {this.state.warningResponseText}
                        </Text>
                    )}
                    <TouchableOpacity
                        testID="transfer-between-accounts"
                        onPress={this.onTransferBetweenAccounts}
                        style={[styles.buttonRightOptions]}
                    >
                        <Text style={styles.textTranferButton}>
                            {this.state.showOwnAccounts
                                ? translate('App.labels.close')
                                : translate('Send.transferOwnAccounts')}
                        </Text>
                    </TouchableOpacity>

                    {this.renderAddAddressToBook()}

                    {this.state.userAction && this.renderContinueAction()}

                    {this.state.isValidText && this.renderBasicFields()}

                    {!this.state.isValidText && this.renderListOrBook()}
                </ScrollView>
                <PasswordModal obRef={ref => (this.passwordModal = ref)} />

                <QrModalReader
                    ref={ref => (this.qrCodeScanner = ref)}
                    onQrCodeScanned={this.onQrCodeScanned}
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
