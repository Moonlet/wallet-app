import React from 'react';
import { Image, View, TextInput, Clipboard, TouchableOpacity } from 'react-native';
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
import { Client as NearClient } from '../../../../core/blockchain/near/client';
import { getChainId } from '../../../../redux/preferences/selectors';
import {
    generateAccountConfig,
    getSelectedAccount,
    getSelectedWallet
} from '../../../../redux/wallets/selectors';
import { IWalletState, IAccountState, AccountType } from '../../../../redux/wallets/state';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { NavigationService } from '../../../../navigation/navigation-service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NearAccountType, NearAccountViewMethods } from '../../../../core/blockchain/near/types';
import { openURL } from '../../../../core/utils/linking-handler';

interface IReduxProps {
    chainId: ChainIdType;
    selectedAccount: IAccountState;
    selectedWallet: IWalletState;
    addAccount: typeof addAccount;
    setSelectedAccount: typeof setSelectedAccount;
}

interface IState {
    input: {
        name: string;
        valid: boolean;
        shouldAuthorize: boolean;
    };

    recoveredAccount: IAccountState;

    action: {
        authorizing: boolean;
        checking: boolean;
        loading: boolean;
    };

    usernameError: {
        notAvailable: boolean;
        notRegistered: boolean;
        notSupported: boolean;
        invalid: boolean;
    };
}

const mapStateToProps = (state: IReduxState) => {
    return {
        chainId: getChainId(state, Blockchain.NEAR),
        selectedWallet: getSelectedWallet(state),
        selectedAccount: getSelectedAccount(state)
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
            input: {
                name: '',
                valid: false,
                shouldAuthorize: false
            },

            recoveredAccount: generateAccountConfig(Blockchain.NEAR),

            action: {
                authorizing: false,
                checking: false,
                loading: false
            },

            usernameError: {
                notAvailable: false,
                notRegistered: false,
                notSupported: false,
                invalid: false
            }
        };
    }

    public componentDidMount() {
        let recoveredAccountIndex = -1;

        for (const acc of this.props.selectedWallet.accounts) {
            if (acc.blockchain === Blockchain.NEAR && acc.index >= recoveredAccountIndex) {
                recoveredAccountIndex = acc.index + 1;
            }
        }

        this.setState({
            recoveredAccount: {
                ...this.state.recoveredAccount,
                publicKey: this.props.selectedAccount.publicKey, // on NEAR we use the same publicKey on all accounts
                index: recoveredAccountIndex === -1 ? 0 : recoveredAccountIndex,
                chainId: this.props.chainId
            }
        });
    }

    public componentWillUnmount() {
        clearInterval(this.startRecoveringAccountInterval);
    }

    private async getLockupContractOwner(accountId: string, client: NearClient): Promise<string> {
        let ownerAccountId: string;

        try {
            ownerAccountId = await client.contractCall({
                contractName: accountId,
                methodName: NearAccountViewMethods.GET_OWNER_ACCOUNT_ID
            });

            await client.contractCall({
                contractName: accountId,
                methodName: NearAccountViewMethods.GET_STAKING_POOL_ACCOUNT_ID
            });
        } catch (err) {
            // no need to handle this
        }

        return ownerAccountId;
    }

    private async validAccountStartRecovering(accountId: string, client: NearClient) {
        const res = await client.viewAccountAccessKey(
            accountId,
            this.state.recoveredAccount.publicKey
        );

        if (res && (res?.permission || res?.nonce)) {
            // Recover automatically
            this.setState({
                input: { ...this.state.input, valid: true, shouldAuthorize: false }
            });
        } else {
            // Needs authorization
            this.setState({
                input: { ...this.state.input, valid: true, shouldAuthorize: true }
            });
        }
    }

    private async checkAccountId(accountId: string) {
        clearInterval(this.startRecoveringAccountInterval);

        this.setState({
            input: {
                name: accountId,
                valid: false,
                shouldAuthorize: false
            },

            action: {
                authorizing: false,
                checking: true,
                loading: false
            },

            // reset error to default
            usernameError: {
                notAvailable: false,
                notRegistered: false,
                notSupported: false,
                invalid: false
            }
        });

        if (accountId.includes('@')) {
            this.setState({
                action: { ...this.state.action, checking: false },
                usernameError: { ...this.state.usernameError, invalid: true }
            });
            return;
        }

        try {
            const client = getBlockchain(Blockchain.NEAR).getClient(
                this.props.chainId
            ) as NearClient;

            const account = await client.getAccount(accountId);

            if (account.exists === true && account.valid === true) {
                if (account.type !== NearAccountType.DEFAULT) {
                    const ownerAccountId = await this.getLockupContractOwner(accountId, client);
                    if (ownerAccountId) {
                        // Lockup contract
                        // Input is valid
                        this.setState(
                            {
                                recoveredAccount: {
                                    ...this.state.recoveredAccount,
                                    type: AccountType.LOCKUP_CONTRACT,
                                    address: accountId,
                                    meta: {
                                        owner: ownerAccountId
                                    }
                                }
                            },
                            () =>
                                this.validAccountStartRecovering(
                                    this.state.recoveredAccount.meta.owner,
                                    client
                                )
                        );
                    } else {
                        // Not supported
                        this.setState({
                            usernameError: { ...this.state.usernameError, notSupported: true }
                        });
                    }
                } else {
                    // Input is valid
                    this.setState(
                        {
                            recoveredAccount: { ...this.state.recoveredAccount, address: accountId }
                        },
                        () => this.validAccountStartRecovering(accountId, client)
                    );
                }
            } else if (account.exists === false && account.valid === true) {
                // Not registered
                this.setState({
                    usernameError: { ...this.state.usernameError, notRegistered: true }
                });
            } else {
                // Not available
                this.setState({
                    usernameError: { ...this.state.usernameError, notAvailable: true }
                });
            }
        } catch (error) {
            // Not available
            this.setState({
                usernameError: { ...this.state.usernameError, notAvailable: true }
            });

            SentryCaptureException(new Error(JSON.stringify(error)));
        }

        // Stop checking
        this.setState({ action: { ...this.state.action, checking: false } });
    }

    private startAuthorizing() {
        const { recoveredAccount } = this.state;

        this.setState({
            action: { ...this.state.action, authorizing: true, loading: false }
        });

        const client = getBlockchain(Blockchain.NEAR).getClient(this.props.chainId) as NearClient;

        clearInterval(this.startRecoveringAccountInterval);
        this.startRecoveringAccountInterval = setInterval(async () => {
            const address = recoveredAccount?.meta?.owner
                ? recoveredAccount.meta.owner
                : recoveredAccount.address;

            const res = await client.viewAccountAccessKey(address, recoveredAccount.publicKey);

            if (res && (res?.permission || res?.nonce)) {
                this.recoverAccount();
            }
        }, 1000);
    }

    private getWalletLoginUrl(): string {
        return getBlockchain(this.state.recoveredAccount.blockchain)
            .networks.filter(n => n.chainId === this.props.chainId)[0]
            .links.getWalletLoginUrl(this.state.recoveredAccount.publicKey);
    }

    private recoverAccount() {
        this.props.addAccount(
            this.props.selectedWallet.id,
            Blockchain.NEAR,
            this.state.recoveredAccount
        );
        this.props.setSelectedAccount(this.state.recoveredAccount);
        NavigationService.navigate('Dashboard', {});
    }

    private renderBottomContainer() {
        const { styles } = this.props;

        if (this.state.action.loading) {
            return <LoadingIndicator />;
        }

        if (this.state.action.authorizing) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <LoadingIndicator />
                    </View>

                    <Button
                        wrapperStyle={styles.copyAuthButton}
                        onPress={() => Clipboard.setString(this.getWalletLoginUrl())}
                    >
                        {translate('RecoverNearAccount.copyAuthLink')}
                    </Button>

                    <Button
                        wrapperStyle={styles.copyAuthButton}
                        primary
                        onPress={() => openURL(this.getWalletLoginUrl())}
                    >
                        {translate('RecoverNearAccount.authMoonlet')}
                    </Button>
                </View>
            );
        }

        return (
            <View style={styles.defaultButtonContainer}>
                <Button
                    wrapperStyle={styles.defaultButton}
                    primary
                    disabled={!this.state.input.valid}
                    onPress={async () => {
                        this.setState({ action: { ...this.state.action, loading: true } }, () => {
                            if (this.state.input.shouldAuthorize) {
                                // start authorization
                                this.startAuthorizing();
                            } else {
                                // recover account automatically
                                this.recoverAccount();
                            }
                        });
                    }}
                >
                    {translate('App.labels.continue')}
                </Button>
            </View>
        );
    }

    public render() {
        const { styles, theme } = this.props;
        const { action, usernameError, input } = this.state;
        const { name, valid, shouldAuthorize } = input;
        const { authorizing, checking } = action;
        const { notAvailable, notRegistered, notSupported, invalid } = usernameError;

        const isChecking = checking && !valid;
        const isUsernameNotRegistered = notRegistered && !valid;
        const isInvalidUsername = invalid && !valid;
        const isUsernameNotAvailable = notAvailable && !valid;
        const isNotSupported = notSupported && !valid;
        const isAuthorizing = authorizing && valid;

        const isCreateAccountActive = !isChecking && isUsernameNotRegistered;

        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={{ flex: 1 }}>
                        <Image
                            source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                            style={styles.moonletImage}
                        />

                        <Text style={styles.authMoonletUserAccountText}>
                            {translate('RecoverNearAccount.checkStatus')}
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
                                    value={name}
                                    onChangeText={inputAccout => this.checkAccountId(inputAccout)}
                                />
                            </View>

                            {!isAuthorizing && (
                                <TouchableOpacity
                                    onPress={() =>
                                        NavigationService.navigate('CreateNearAccount', {
                                            accountId: name
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
                                                    isUsernameNotAvailable ||
                                                    isNotSupported) &&
                                                    styles.errorText,
                                                isChecking && styles.checkingText,
                                                valid && shouldAuthorize
                                                    ? styles.checkingText
                                                    : styles.congratsText
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
                                                : isNotSupported
                                                ? translate('RecoverNearAccount.notSupported')
                                                : valid && !shouldAuthorize
                                                ? translate('RecoverNearAccount.congrats', { name })
                                                : valid && shouldAuthorize
                                                ? translate('RecoverNearAccount.needAuthorize', {
                                                      name
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

                        <View style={{ flex: 1 }}>{this.renderBottomContainer()}</View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export const RecoverNearAccountScreen = smartConnect(RecoverNearAccountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
