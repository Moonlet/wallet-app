import React from 'react';
import { Image, View, TextInput, Clipboard, Linking } from 'react-native';
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
import { disableRecoverAccount } from '../../../../redux/ui/screens/dashboard/actions';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { NEAR_TESTNET_MASTER_ACCOUNT } from '../../../../core/constants/app';
import { LoadingModal } from '../../../../components/loading-modal/loading-modal';
import { NavigationService } from '../../../../navigation/navigation-service';

const NEAR_AUTH_URL = `https://wallet.testnet.near.org/login/?title=Moonlet&public_key=`;

interface IReduxProps {
    chainId: ChainIdType;
    selectedWallet: IWalletState;
    addAccount: typeof addAccount;
    setSelectedAccount: typeof setSelectedAccount;
    disableRecoverAccount: typeof disableRecoverAccount;
}

interface IState {
    inputAccout: string;
    isInputValid: boolean;
    isChecking: boolean;
    isUsernameNotRegistered: boolean;
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
    setSelectedAccount,
    disableRecoverAccount
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

        if (accountId.includes('.') || accountId.includes('@')) {
            this.setState({
                isInputValid: false,
                isInvalidUsername: true,
                isUsernameNotRegistered: false,
                isChecking: false
            });
            return;
        }

        try {
            const blockchainInstance = getBlockchain(Blockchain.NEAR);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            const account = await client.getAccount(`${accountId}.${NEAR_TESTNET_MASTER_ACCOUNT}`);

            if (account.exists === true && account.valid === true) {
                this.setState({
                    isInputValid: true,
                    isInvalidUsername: false,
                    isUsernameNotRegistered: false,
                    isChecking: false
                });
            } else {
                this.setState({
                    isInputValid: false,
                    isInvalidUsername: false,
                    isUsernameNotRegistered: true,
                    isChecking: false
                });
            }
        } catch (error) {
            this.setState({
                isInputValid: false,
                isInvalidUsername: false,
                isUsernameNotRegistered: true,
                isChecking: false
            });
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

            const numberOfAccounts = selectedWallet.accounts.filter(
                acc => acc.blockchain === Blockchain.NEAR
            ).length;

            const accounts = await hdWallet.getAccounts(Blockchain.NEAR, numberOfAccounts);
            const account = accounts[0];

            if (account) {
                this.setState({
                    recoveredAccount: {
                        ...account,
                        address: `${this.state.inputAccout}.${NEAR_TESTNET_MASTER_ACCOUNT}`
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
        const isAuthorizing = this.state.isAuthorizing && this.state.isInputValid;

        return (
            <View style={styles.container}>
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
                                placeholder={translate('RecoverNearAccount.eg')}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                selectionColor={theme.colors.accent}
                                returnKeyType="done"
                                value={this.state.inputAccout}
                                onChangeText={inputAccout => {
                                    this.checkAccountId(inputAccout);
                                }}
                            />

                            <Text style={styles.domain}>{`.${NEAR_TESTNET_MASTER_ACCOUNT}`}</Text>
                        </View>

                        {!isAuthorizing && (
                            <Text
                                style={[
                                    styles.infoText,
                                    isUsernameNotRegistered && styles.errorText,
                                    isInvalidUsername && styles.errorText,
                                    isChecking && styles.checkingText,
                                    this.state.isInputValid && styles.congratsText
                                ]}
                            >
                                {isChecking
                                    ? translate('RecoverNearAccount.checking')
                                    : isUsernameNotRegistered
                                    ? translate('RecoverNearAccount.notRegistered')
                                    : isInvalidUsername
                                    ? translate('RecoverNearAccount.invalid')
                                    : this.state.isInputValid
                                    ? translate('RecoverNearAccount.congrats', {
                                          name: `${this.state.inputAccout}.${NEAR_TESTNET_MASTER_ACCOUNT}`
                                      })
                                    : ''}
                            </Text>
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

                            const url = NEAR_AUTH_URL + this.state.recoveredAccount.publicKey;
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
                            const url = NEAR_AUTH_URL + this.state.recoveredAccount.publicKey;
                            Linking.canOpenURL(url).then(
                                supported => supported && Linking.openURL(url)
                            );
                            this.startRecoveringAccount();
                        }
                    }}
                >
                    {translate('RecoverNearAccount.authMoonlet')}
                </Button>
            </View>
        );
    }
}

export const RecoverNearAccountScreen = smartConnect(RecoverNearAccountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
