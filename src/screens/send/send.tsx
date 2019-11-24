import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { Icon } from '../../components/icon';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Button } from '../../library/button/button';
import { ITheme } from '../../core/theme/itheme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { QrModalReader } from '../../components/qr-modal/qr-modal';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState } from '../../redux/wallets/state';
import { AccountAddress } from '../../components/account-address/account-address';
import { AccountList } from './components/account-list/account-list';
import { sendTransferTransaction } from '../../redux/wallets/actions';
import { getAccounts, getAccount } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import { Blockchain } from '../../core/blockchain/types';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { FeeOptions } from './components/fee-options/fee-options';
import BigNumber from 'bignumber.js';
import { IResultValidation } from '../../core/wallet/types';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    account: IAccountState;
    accounts: IAccountState[];
    sendTransferTransaction: typeof sendTransferTransaction;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        accounts: getAccounts(state, ownProps.blockchain)
    };
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
}

interface IState {
    toAddress: string;
    amount: string;
    isValidAddress: boolean;
    addressInputValid: boolean;
    displayValidationWarning: boolean;
    showOwnAccounts: boolean;
    insufficientFunds: boolean;
    gasPrice: BigNumber;
    gasLimit: BigNumber;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('App.labels.send')
});
export class SendScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IProps & IReduxProps,
    IState
> {
    public static navigationOptions = navigationOptions;
    public qrCodeScanner: any;

    constructor(props: INavigationProps<INavigationParams> & IProps & IReduxProps) {
        super(props);

        this.state = {
            toAddress: '',
            amount: '',
            isValidAddress: false,
            addressInputValid: true,
            insufficientFunds: false,
            displayValidationWarning: false,
            showOwnAccounts: false,
            gasPrice: undefined,
            gasLimit: undefined
        };
    }

    public confirmPayment = async () => {
        this.props.sendTransferTransaction(
            this.props.account,
            this.state.toAddress,
            this.state.amount,
            this.state.gasPrice,
            this.state.gasLimit
        );
        this.props.navigation.goBack();
    };

    public onPressQrCodeIcon = async () => {
        this.qrCodeScanner.open();
    };

    public verifyAddress = (text: string) => {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        this.setState({ toAddress: text });

        const addressValidation: IResultValidation = blockchainInstance.account.isValidAddress(
            text
        );

        this.setState({
            isValidAddress: addressValidation.valid,
            addressInputValid: addressValidation.valid,
            displayValidationWarning:
                addressValidation.valid && addressValidation.responseType === 'warning'
        });
    };
    public onQrCodeScanned = (value: string) => {
        this.verifyAddress(value);
    };

    public onTransferBetweenAccounts = () => {
        const currentState = this.state.showOwnAccounts;
        this.setState({ showOwnAccounts: !currentState, isValidAddress: false, toAddress: '' });
    };

    public onAccountSelection = (account: IAccountState) => {
        this.setState({ toAddress: account.address, showOwnAccounts: false });
        this.verifyAddress(account.address);
    };

    public calculatedFees = (gasPrice: BigNumber, gasLimit: BigNumber) => {
        this.setState({ gasPrice, gasLimit }, () => this.availableFunds());
    };

    public addAmount = (value: string) => {
        this.setState({ amount: value }, () => this.availableFunds());
    };

    public availableFunds() {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const stdAmount = blockchainInstance.account.amountToStd(
            new BigNumber(Number(this.state.amount))
        );
        this.setState({ insufficientFunds: true });
        const completeAmount = this.state.gasPrice.plus(stdAmount);
        if (!this.props.account.balance?.value.minus(completeAmount).isGreaterThan(0)) {
            this.setState({ insufficientFunds: true });
        } else {
            this.setState({ insufficientFunds: false });
        }
    }

    public renderBasicFields() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        return (
            <View style={styles.basicFields}>
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
                        onChangeText={value => {
                            this.addAmount(value);
                        }}
                    />
                </View>
                {this.state.insufficientFunds ? (
                    <Text style={styles.displayError}>{translate('Send.insufficientFunds')}</Text>
                ) : null}

                <FeeOptions
                    account={this.props.account}
                    toAddress={this.state.toAddress}
                    calculatedFees={this.calculatedFees}
                />

                <View style={styles.bottom}>
                    <Button
                        testID="confirm-payment"
                        style={styles.bottomButton}
                        primary
                        disabled={!this.state.isValidAddress || this.state.amount === ''}
                        onPress={this.confirmPayment}
                    >
                        {translate('App.labels.confirmPayment')}
                    </Button>
                </View>
            </View>
        );
    }

    public onPressClearInput = () => {
        this.setState({
            isValidAddress: false,
            toAddress: '',
            addressInputValid: true,
            displayValidationWarning: false
        });
    };

    public renderRightAddressIcon() {
        const styles = this.props.styles;
        if (Platform.OS === 'web') {
            return null;
        }

        if (!this.state.isValidAddress) {
            return (
                <TouchableOpacity
                    testID="qrcode-icon"
                    onPress={this.onPressQrCodeIcon}
                    style={[styles.rightAddressButton]}
                >
                    <Icon name="qr-code-scan" size={20} style={styles.icon} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    testID="clear-address"
                    onPress={this.onPressClearInput}
                    style={[styles.rightAddressButton]}
                >
                    <Icon name="close" size={20} style={styles.icon} />
                </TouchableOpacity>
            );
        }
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        const account = this.props.account;

        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <KeyboardAvoidingView
                        style={styles.keyboardAvoidance}
                        behavior={Platform.OS === 'ios' ? 'position' : null}
                    >
                        <View style={styles.accountAddress}>
                            <AccountAddress account={account} />
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
                                editable={!this.state.isValidAddress}
                                selectionColor={theme.colors.accent}
                                value={
                                    this.state.isValidAddress
                                        ? formatAddress(this.state.toAddress)
                                        : this.state.toAddress
                                }
                                onChangeText={text => {
                                    this.verifyAddress(text);
                                }}
                            />
                            {this.renderRightAddressIcon()}
                        </View>
                        {!this.state.addressInputValid ? (
                            <Text style={styles.displayError}>
                                {translate('Send.recipientNotValid')}
                            </Text>
                        ) : null}
                        {this.state.displayValidationWarning ? (
                            <Text style={styles.receipientWarning}>
                                {translate('Send.receipientWarning')}
                            </Text>
                        ) : null}
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

                        {this.state.isValidAddress ? this.renderBasicFields() : null}

                        {this.state.showOwnAccounts ? (
                            <AccountList
                                accounts={this.props.accounts}
                                onAccountSelection={this.onAccountSelection}
                            />
                        ) : null}

                        <QrModalReader
                            ref={ref => (this.qrCodeScanner = ref)}
                            onQrCodeScanned={this.onQrCodeScanned}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}

export const SendScreen = smartConnect(SendScreenComponent, [
    connect(mapStateToProps, { sendTransferTransaction }),
    withTheme(stylesProvider),
    withNavigationParams()
]);
