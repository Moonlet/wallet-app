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
import { HeaderLeft } from '../../components/header-left/header-left';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain, BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { QrModalReader } from '../../components/qr-modal/qr-modal';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState } from '../../redux/wallets/state';
import { AccountAddress } from '../../components/account-address/account-address';
import { AccountList } from './components/account-list/account-list';
import { sendTransferTransaction } from '../../redux/wallets/actions';

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
        account: state.wallets[state.app.currentWalletIndex].accounts[ownProps.accountIndex],
        accounts: state.wallets[state.app.currentWalletIndex].accounts
    };
};

export interface INavigationParams {
    accountIndex: number;
}

interface IState {
    toAddress: string;
    amount: string;
    fee: string;
    isValidAddress: boolean;
    showOwnAccounts: boolean;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack();
                }}
            />
        );
    },
    title: 'Send'
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
        this.setState({ toAddress: '0xfeb8fa91f64f52ee66f7095486caaf0a1227e254', amount: '0.001' });
        this.verifyAddress('0xfeb8fa91f64f52ee66f7095486caaf0a1227e254');
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
        this.setState({ showOwnAccounts: !currentState });
    };

    public onAccountSelection = (account: IAccountState) => {
        this.setState({ toAddress: account.address, showOwnAccounts: false });
        this.verifyAddress(account.address);
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
                <View style={styles.inputBox}>
                    <TextInput
                        testID="fee"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={this.state.fee}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        editable={false}
                    />
                </View>
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
                {this.state.toAddress !== '' ? (
                    <Text style={styles.receipientLabel}>{translate('Send.recipientLabel')}</Text>
                ) : null}
                <View
                    style={[
                        styles.inputBoxAddress,
                        { marginTop: this.state.toAddress !== '' ? 0 : 40 }
                    ]}
                >
                    <TextInput
                        testID="input-address"
                        style={styles.inputAddress}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Send.inputAddress')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.toAddress}
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
                    style={[styles.buttonTransfer]}
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
