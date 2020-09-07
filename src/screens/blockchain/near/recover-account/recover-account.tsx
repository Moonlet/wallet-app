import React from 'react';
import { Image, View, TextInput, Clipboard, Linking, TouchableOpacity } from 'react-native';
import { Text, Button } from '../../../../library';
import stylesProvider from './styles';
import { Blockchain, ChainIdType } from '../../../../core/blockchain/types';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { addAccount, setSelectedAccount } from '../../../../redux/wallets/actions';
import { IReduxState } from '../../../../redux/state';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { Client as NearClient } from '../../../../core/blockchain/near/client';
import { getChainId } from '../../../../redux/preferences/selectors';
import { WalletFactory } from '../../../../core/wallet/wallet-factory';
import { getSelectedWallet } from '../../../../redux/wallets/selectors';
import { IWalletState, IAccountState } from '../../../../redux/wallets/state';
import { IWallet } from '../../../../core/wallet/types';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import {
    NEAR_TESTNET_MASTER_ACCOUNT,
    NEAR_TESTNET_RECOVER_EXTENSION
} from '../../../../core/constants/app';
import { LoadingModal } from '../../../../components/loading-modal/loading-modal';
import { NavigationService } from '../../../../navigation/navigation-service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface IReduxProps {
    chainId: ChainIdType;
    selectedWallet: IWalletState;
    addAccount: typeof addAccount;
    setSelectedAccount: typeof setSelectedAccount;
}

interface IState {
    inputAccout: string;
    isInputValid: boolean;
    isChecking: boolean;
    isUsernameNotRegistered: boolean;
    isUsernameNotAvailable: boolean;
    isInvalidUsername: boolean;
    isAuthorizing: boolean;
    recoveredAccount: IAccountState;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        chainId: getChainId(state, Blockchain.NEAR),
        selectedWallet: getSelectedWallet(state)
    };
};

const mapDispatchToProps = {
    addAccount,
    setSelectedAccount
};

const navigationOptions = () => ({ title: translate('RecoverNearAccount.title') });

export class RecoverNearAccountComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    private startRecoveringAccountInterval;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            inputAccout: '',
            isInputValid: false,
            isChecking: false,
            isUsernameNotRegistered: false,
            isUsernameNotAvailable: false,
            isInvalidUsername: false,
            isAuthorizing: false,
            recoveredAccount: undefined
        };
    }

    public componentWillUnmount() {
        clearInterval(this.startRecoveringAccountInterval);
    }

    private async checkAccountId(accountId: string) {
        this.setState({
            inputAccout: accountId,
            isChecking: true,
            isAuthorizing: false,
            recoveredAccount: undefined
        });

        if (accountId.includes('@')) {
            this.setState({
                isInputValid: false,
                isInvalidUsername: true,
                isUsernameNotRegistered: false,
                isUsernameNotAvailable: false,
                isChecking: false
            });
            return;
        }

        try {
            const blockchainInstance = getBlockchain(Blockchain.NEAR);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            const account = await client.getAccount(
                `${accountId}.${NEAR_TESTNET_RECOVER_EXTENSION}`
            );

            if (account.exists === true && account.valid === true) {
                this.setState({
                    isInputValid: true,
                    isInvalidUsername: false,
                    isUsernameNotRegistered: false,
                    isUsernameNotAvailable: false,
                    isChecking: false
                });
            } else if (account.exists === false && account.valid === true) {
                this.setState({
                    isInputValid: false,
                    isInvalidUsername: false,
                    isUsernameNotRegistered: true,
                    isUsernameNotAvailable: false,
                    isChecking: false
                });
            } else {
                this.setState({
                    isInputValid: false,
                    isInvalidUsername: false,
                    isUsernameNotRegistered: false,
                    isUsernameNotAvailable: true,
                    isChecking: false
                });
            }
        } catch (error) {
            this.setState({
                isInputValid: false,
                isInvalidUsername: false,
                isUsernameNotRegistered: false,
                isUsernameNotAvailable: true,
                isChecking: false
            });

            SentryCaptureException(new Error(JSON.stringify(error)));
        }
    }

    private startRecoveringAccount() {
        const { recoveredAccount } = this.state;
        const client = getBlockchain(Blockchain.NEAR).getClient(this.props.chainId) as NearClient;

        clearInterval(this.startRecoveringAccountInterval);
        this.startRecoveringAccountInterval = setInterval(async () => {
            const res = await client.viewAccountAccessKey(
                recoveredAccount.address,
                recoveredAccount.publicKey
            );

            if (res && (res?.permission || res?.nonce)) {
                this.props.addAccount(
                    this.props.selectedWallet.id,
                    Blockchain.NEAR,
                    recoveredAccount
                );
                this.props.setSelectedAccount(recoveredAccount);
                NavigationService.navigate('Dashboard', {});
            }
        }, 1000);
    }

    private async generatePublicKey() {
        try {
            const password = await PasswordModal.getPassword();

            await LoadingModal.open();

            const selectedWallet: IWalletState = this.props.selectedWallet;
            const hdWallet: IWallet = await WalletFactory.get(
                selectedWallet.id,
                selectedWallet.type,
                { pass: password }
            );

            let account: IAccountState;

            const numberOfAccounts = selectedWallet.accounts.filter(
                acc => acc.blockchain === Blockchain.NEAR
            ).length;

            const address = `${this.state.inputAccout}.${NEAR_TESTNET_RECOVER_EXTENSION}`;

            if (address.includes(NEAR_TESTNET_MASTER_ACCOUNT)) {
                // account has been created by Moonlet master account

                const client = getBlockchain(Blockchain.NEAR).getClient(
                    this.props.chainId
                ) as NearClient;

                await Promise.all([
                    hdWallet.getAccounts(Blockchain.NEAR, 0),
                    hdWallet.getAccounts(Blockchain.NEAR, 1),
                    hdWallet.getAccounts(Blockchain.NEAR, 2),
                    hdWallet.getAccounts(Blockchain.NEAR, 3),
                    hdWallet.getAccounts(Blockchain.NEAR, 4)
                ]).then(async data => {
                    const publicKeys: string[] = data.reduce(
                        (out: any, acc: any) => out.concat(acc[0].publicKey),
                        []
                    );

                    for (const publicKey of publicKeys) {
                        const res = await client.viewAccountAccessKey(address, publicKey);

                        if (res && (res?.permission || res?.nonce)) {
                            const recoverAccount = data.find(acc => acc[0].publicKey === publicKey);

                            account = recoverAccount[0];
                            account.publicKey = publicKey;
                            account.index = numberOfAccounts; // fix the index
                        }
                    }
                });
            } else {
                // account has been created outside of Moonlet

                const accounts = await hdWallet.getAccounts(Blockchain.NEAR, numberOfAccounts);
                account = accounts[0];
            }

            if (account) {
                this.setState({
                    recoveredAccount: {
                        ...account,
                        address
                    }
                });
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }

        await LoadingModal.close();
    }

    public render() {
        const { styles, theme } = this.props;

        const isChecking = this.state.isChecking && !this.state.isInputValid;
        const isUsernameNotRegistered =
            this.state.isUsernameNotRegistered && !this.state.isInputValid;
        const isInvalidUsername = this.state.isInvalidUsername && !this.state.isInputValid;
        const isUsernameNotAvailable =
            this.state.isUsernameNotAvailable && !this.state.isInputValid;
        const isAuthorizing = this.state.isAuthorizing && this.state.isInputValid;

        const isCreateAccountActive = !isChecking && isUsernameNotRegistered;

        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={{ flex: 1 }}>
                        <Image
                            source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                            style={styles.moonletImage}
                        />

                        <Text style={styles.authMoonletUserAccountText}>
                            {translate('RecoverNearAccount.authMoonletUserAccount')}
                        </Text>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputBox}>
                                <TextInput
                                    style={styles.inputText}
                                    placeholderTextColor={theme.colors.textTertiary}
                                    placeholder={translate('AddAccount.eg')}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    selectionColor={theme.colors.accent}
                                    returnKeyType="done"
                                    value={this.state.inputAccout}
                                    onChangeText={inputAccout => {
                                        this.checkAccountId(inputAccout);
                                    }}
                                />

                                <Text style={styles.domain}>
                                    {`.${NEAR_TESTNET_RECOVER_EXTENSION}`}
                                </Text>
                            </View>

                            {!isAuthorizing && (
                                <TouchableOpacity
                                    onPress={() =>
                                        NavigationService.navigate('CreateNearAccount', {
                                            accountId: this.state.inputAccout
                                        })
                                    }
                                    disabled={!isCreateAccountActive}
                                >
                                    <Text>
                                        <Text
                                            style={[
                                                styles.infoText,
                                                (isUsernameNotRegistered ||
                                                    isInvalidUsername ||
                                                    isUsernameNotAvailable) &&
                                                    styles.errorText,
                                                isChecking && styles.checkingText,
                                                this.state.isInputValid && styles.congratsText
                                            ]}
                                        >
                                            {isChecking
                                                ? translate('AddAccount.checking')
                                                : isUsernameNotRegistered
                                                ? translate('RecoverNearAccount.notRegistered')
                                                : isInvalidUsername
                                                ? translate('AddAccount.invalid')
                                                : isUsernameNotAvailable
                                                ? translate('AddAccount.notAvailable')
                                                : this.state.isInputValid
                                                ? translate('RecoverNearAccount.congrats', {
                                                      name: `${this.state.inputAccout}.${NEAR_TESTNET_RECOVER_EXTENSION}`
                                                  })
                                                : ''}
                                        </Text>

                                        <Text style={[styles.infoText, styles.createHereText]}>
                                            {isCreateAccountActive
                                                ? ` ${translate('RecoverNearAccount.createHere')}`
                                                : ''}
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {isAuthorizing && (
                            <View style={styles.authProgressContainer}>
                                <View style={styles.loadingContainer}>
                                    <LoadingIndicator />
                                </View>
                                <Text style={styles.authProgressText}>
                                    {translate('RecoverNearAccount.authProgress')}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Button
                        wrapperStyle={styles.copyAuthButton}
                        disabledSecondary={!this.state.isInputValid}
                        onPress={async () => {
                            if (!this.state.recoveredAccount) {
                                await this.generatePublicKey();
                            }

                            if (this.state.recoveredAccount) {
                                this.setState({ isAuthorizing: true });

                                const url = getBlockchain(this.state.recoveredAccount.blockchain)
                                    .networks.filter(n => n.chainId === this.props.chainId)[0]
                                    .links.getWalletLoginUrl(this.state.recoveredAccount.publicKey);

                                Clipboard.setString(url);
                                this.startRecoveringAccount();
                            }
                        }}
                    >
                        {translate('RecoverNearAccount.copyAuthLink')}
                    </Button>

                    <Button
                        wrapperStyle={styles.authButton}
                        primary
                        disabled={!this.state.isInputValid}
                        onPress={async () => {
                            if (!this.state.recoveredAccount) {
                                await this.generatePublicKey();
                            }

                            if (this.state.recoveredAccount) {
                                this.setState({ isAuthorizing: true });

                                if (
                                    this.state.recoveredAccount.address.includes(
                                        NEAR_TESTNET_MASTER_ACCOUNT
                                    )
                                ) {
                                    // open wallet login url not needed

                                    this.startRecoveringAccount();
                                    return;
                                }

                                const url = getBlockchain(this.state.recoveredAccount.blockchain)
                                    .networks.filter(n => n.chainId === this.props.chainId)[0]
                                    .links.getWalletLoginUrl(this.state.recoveredAccount.publicKey);

                                Linking.canOpenURL(url).then(
                                    supported => supported && Linking.openURL(url)
                                );

                                this.startRecoveringAccount();
                            }
                        }}
                    >
                        {translate('RecoverNearAccount.authMoonlet')}
                    </Button>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export const RecoverNearAccountScreen = smartConnect(RecoverNearAccountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
