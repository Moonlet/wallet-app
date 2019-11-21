import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
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
import { getBlockchain, BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
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
    fee: string;
    isValidAddress: boolean;
    showOwnAccounts: boolean;
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
            fee: '',
            isValidAddress: false,
            showOwnAccounts: false
        };
    }

    public confirmPayment = async () => {
        this.props.sendTransferTransaction(
            this.props.account,
            this.state.toAddress,
            this.state.amount
        );
        this.props.navigation.goBack();
    };

    public onPressQrCodeIcon = async () => {
        this.qrCodeScanner.open();
    };

    public verifyAddress = (text: string) => {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        this.setState({ toAddress: text });
        if (blockchainInstance.account.isValidAddress(text)) {
            this.setState({ isValidAddress: true });
        }
    };
    public addAmount = (value: string) => {
        this.setState({
            amount: value,
            fee: '0.001' + BLOCKCHAIN_INFO[this.props.account.blockchain].coin
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

    public estimatedFees = (fees: any) => {
        //
    };

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

                <FeeOptions account={this.props.account} estimatedFees={this.estimatedFees} />

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

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        const account = this.props.account;

        return (
            <View style={styles.container}>
                <AccountAddress account={account} />
                <Text style={styles.receipientLabel}>
                    {this.state.toAddress !== '' ? translate('Send.recipientLabel') : ' '}
                </Text>
                <View style={[styles.inputBoxAddress]}>
                    <TextInput
                        testID="input-address"
                        style={styles.inputAddress}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Send.inputAddress')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={formatAddress(this.state.toAddress)}
                        onChangeText={text => {
                            this.verifyAddress(text);
                        }}
                    />
                    {Platform.OS !== 'web' ? (
                        <TouchableOpacity
                            testID="qrcode-icon"
                            onPress={this.onPressQrCodeIcon}
                            style={[styles.qrButton]}
                        >
                            <Icon name="qr-code-scan" size={20} style={styles.icon} />
                        </TouchableOpacity>
                    ) : null}
                </View>

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
            </View>
        );
    }
}

export const SendScreen = smartConnect(SendScreenComponent, [
    connect(mapStateToProps, { sendTransferTransaction }),
    withTheme(stylesProvider),
    withNavigationParams()
]);
