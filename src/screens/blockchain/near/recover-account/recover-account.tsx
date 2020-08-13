import React from 'react';
import { View, TextInput, TouchableOpacity, Clipboard, Linking } from 'react-native';
import { Text, Button } from '../../../../library';
import stylesProvider from './styles';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Blockchain, ChainIdType } from '../../../../core/blockchain/types';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';

import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { createAccount, addAccount, setSelectedAccount } from '../../../../redux/wallets/actions';
import { IReduxState } from '../../../../redux/state';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { Client as NearClient } from '../../../../core/blockchain/near/client';
import { getChainId } from '../../../../redux/preferences/selectors';
import { WalletFactory } from '../../../../core/wallet/wallet-factory';
import { getSelectedWallet } from '../../../../redux/wallets/selectors';
import { IWalletState } from '../../../../redux/wallets/state';
import { IWallet } from '../../../../core/wallet/types';
import { disableRecoverAccount } from '../../../../redux/ui/screens/dashboard/actions';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import bind from 'bind-decorator';
import Icon from '../../../../components/icon/icon';
import { IconValues } from '../../../../components/icon/values';
import { normalize, BASE_DIMENSION } from '../../../../styles/dimensions';

export interface IReduxProps {
    createAccount: typeof createAccount;
    chainId: ChainIdType;
    selectedWallet: IWalletState;
    addAccount: typeof addAccount;
    setSelectedAccount: typeof setSelectedAccount;
    disableRecoverAccount: typeof disableRecoverAccount;
}

export interface IExternalProps {
    blockchain: Blockchain;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface IState {
    inputAccout: string;
    isInputValid: boolean;
    showInputInfo: boolean;
    isRecover: boolean;
    isLoading: boolean;
    showRecoverWithPublicKey: boolean;
    isRecoverWithPublicKey: boolean;
    showOptions: boolean;
    publicKey: string;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        chainId: getChainId(state, ownProps.blockchain),
        selectedWallet: getSelectedWallet(state)
    };
};

const mapDispatchToProps = {
    createAccount,
    addAccount,
    setSelectedAccount,
    disableRecoverAccount
};

export class RecoverNearAccountComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            inputAccout: '',
            isInputValid: false,
            showInputInfo: false,
            isRecover: false,
            isLoading: false,
            showRecoverWithPublicKey: false,
            isRecoverWithPublicKey: false,
            showOptions: true,
            publicKey: ''
        };
    }

    private async recoverWithPublickKey() {
        try {
            const password = await PasswordModal.getPassword();

            this.setState({ isLoading: true });

            const blockchain = this.props.blockchain;

            const selectedWallet: IWalletState = this.props.selectedWallet;
            const hdWallet: IWallet = await WalletFactory.get(
                selectedWallet.id,
                selectedWallet.type,
                {
                    pass: password
                }
            );

            const account = await hdWallet.getAccounts(blockchain, 0);

            if (account && account[0].publicKey) {
                this.setState({ publicKey: account[0].publicKey });
            }

            this.setState({ isLoading: false });

            return;
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    private renderOptions() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{translate('RecoverAccount.title')}</Text>
                <TouchableOpacity
                    style={styles.rowCardContainer}
                    onPress={async () => {
                        await this.recoverWithPublickKey();
                        this.setState({ showOptions: false, showRecoverWithPublicKey: true });
                    }}
                >
                    <View style={styles.cardInfoContainer}>
                        <Text style={styles.firstTCardText}>
                            {translate('RecoverAccount.publicKey')}
                        </Text>
                        <Text style={styles.secondCardText}>
                            {translate('RecoverAccount.pkText')}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rowCardContainer}
                    onPress={() =>
                        this.setState({ showOptions: false, showRecoverWithPublicKey: false })
                    }
                >
                    <View style={styles.cardInfoContainer}>
                        <Text style={styles.firstTCardText}>
                            {translate('RecoverAccount.userName')}
                        </Text>
                        <Text style={styles.secondCardText}>
                            {translate('RecoverAccount.userNameText')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    private async recoverAccount() {
        try {
            const password = await PasswordModal.getPassword();

            this.setState({ isLoading: true });

            const blockchain = this.props.blockchain;

            const selectedWallet: IWalletState = this.props.selectedWallet;
            const hdWallet: IWallet = await WalletFactory.get(
                selectedWallet.id,
                selectedWallet.type,
                { pass: password }
            );

            const blockchainInstance = getBlockchain(blockchain);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            Promise.all([
                hdWallet.getAccounts(blockchain, 0),
                hdWallet.getAccounts(blockchain, 1),
                hdWallet.getAccounts(blockchain, 2),
                hdWallet.getAccounts(blockchain, 3),
                hdWallet.getAccounts(blockchain, 4)
            ]).then(async data => {
                const publicKeys: string[] = data.reduce(
                    (out: any, acc: any) => out.concat(acc[0].publicKey),
                    []
                );

                let found = false;

                // TODO: fix recover index

                for (const publicKey of publicKeys) {
                    const res = await client.recoverAccount(this.state.inputAccout, publicKey);

                    if (res && (res?.permission || res?.nonce)) {
                        found = true;
                        const account = data.find(acc => acc[0].publicKey);
                        const recoverAccount = account[0];
                        recoverAccount.address = this.state.inputAccout;

                        this.props.addAccount(selectedWallet.id, blockchain, recoverAccount);
                        this.props.setSelectedAccount(recoverAccount);
                        this.props.disableRecoverAccount();
                    }
                }

                if (!found) {
                    if (!this.state.showRecoverWithPublicKey) {
                        this.setState({
                            isRecoverWithPublicKey: true,
                            isInputValid: false,
                            showInputInfo: false,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isRecoverWithPublicKey: true,
                            isInputValid: false,
                            showInputInfo: true,
                            isLoading: false
                        });
                    }
                } else {
                    this.setState({ isLoading: false });
                }
            });
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    private async checkAccountIdValid() {
        if (this.props.blockchain === Blockchain.NEAR) {
            const blockchainInstance = getBlockchain(this.props.blockchain);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            try {
                const account = await client.getAccount(this.state.inputAccout);

                this.setState({ isInputValid: account.exists, showInputInfo: true });

                if (account.exists) {
                    this.setState({ isRecover: true });
                }
            } catch (error) {
                this.setState({ isInputValid: false, showInputInfo: true });
            }
        }
    }

    @bind
    private onPressClearInput() {
        this.setState({
            inputAccout: '',
            isInputValid: false,
            showInputInfo: false,
            isRecover: false,
            isLoading: false
        });
    }

    private renderRecoverPublicKey() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.infoRow}
                    onPress={() =>
                        Linking.openURL(
                            `https://wallet.testnet.near.org/login/?title=Moonlet&public_key=${this.state.publicKey}`
                        )
                    }
                >
                    <View key="circle-1" style={styles.circle}>
                        <Text key="number-1" style={styles.number}>{`1`}</Text>
                    </View>
                    <Text style={styles.infoText}>
                        {translate('RecoverAccount.recoverPKTitle')}
                    </Text>
                </TouchableOpacity>

                <View style={styles.infoRow}>
                    <View key="circle-2" style={styles.circle}>
                        <Text key="number-2" style={styles.number}>{`2`}</Text>
                    </View>
                    <Text style={styles.infoText}>
                        {translate('RecoverAccount.confirmRecover')}
                    </Text>
                </View>

                <View style={styles.inputWrapper}>
                    {this.renderInput()}
                    {!this.state.isInputValid && this.state.showInputInfo && (
                        <Text style={styles.invalidText}>
                            {translate('RecoverAccount.invalidUserPublicKey')}
                        </Text>
                    )}
                </View>

                <View style={styles.buttonsContainer}>
                    <Button
                        wrapperStyle={{ flex: 1, marginRight: BASE_DIMENSION / 2 }}
                        onPress={() =>
                            Clipboard.setString(
                                `https://wallet.testnet.near.org/login/?title=Moonlet&public_key=${this.state.publicKey}`
                            )
                        }
                    >
                        {translate('RecoverAccount.copyLink')}
                    </Button>
                    <Button
                        wrapperStyle={{ flex: 1, marginLeft: BASE_DIMENSION / 2 }}
                        primary
                        onPress={() => this.recoverAccount()}
                        disabled={this.state.inputAccout === ''}
                    >
                        {translate('App.labels.recover')}
                    </Button>
                </View>
            </View>
        );
    }

    private renderInput() {
        const { styles, theme } = this.props;

        return (
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={theme.colors.textTertiary}
                    placeholder={translate('CreateAccount.eg')}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    selectionColor={theme.colors.accent}
                    value={this.state.inputAccout}
                    onChangeText={inputAccout =>
                        this.setState({
                            inputAccout,
                            showInputInfo: false,
                            isRecover: false
                        })
                    }
                />
                {this.state.inputAccout.length !== 0 && (
                    <TouchableOpacity
                        onPress={this.onPressClearInput}
                        style={[styles.rightAddressButton]}
                    >
                        <Icon name={IconValues.CLOSE} size={normalize(16)} style={styles.icon} />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    public renderRecoverMoonlet() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.createText}>{translate('RecoverAccount.recoverNear')}</Text>
                <Text style={styles.chooseUsernameText}>
                    {translate('RecoverAccount.chooseUsername')}
                </Text>

                <View style={styles.inputContainer}>
                    {this.renderInput()}
                    {this.state.isInputValid && this.state.showInputInfo && (
                        <Text style={styles.congratsText}>
                            {translate('RecoverAccount.congrats')}
                        </Text>
                    )}
                    {!this.state.isInputValid && this.state.showInputInfo && (
                        <Text style={styles.invalidText}>
                            {translate('RecoverAccount.invalidUsername')}
                        </Text>
                    )}
                    {this.state.isRecoverWithPublicKey && (
                        <TouchableOpacity
                            onPress={async () => {
                                await this.recoverWithPublickKey();
                                this.setState({
                                    showOptions: false,
                                    showRecoverWithPublicKey: true
                                });
                            }}
                        >
                            <Text style={styles.congratsText}>
                                {translate('RecoverAccount.recoverPublicKey')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Button
                    style={styles.createButton}
                    primary
                    disabled={this.state.inputAccout.length === 0}
                    onPress={() => {
                        if (this.state.isRecover) {
                            // recover account
                            this.recoverAccount();
                        } else {
                            // check is account name is valid
                            this.checkAccountIdValid();
                        }
                    }}
                >
                    {this.state.isRecover
                        ? translate('App.labels.recover')
                        : translate('App.labels.check')}
                </Button>
            </View>
        );
    }

    public render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />;
        } else {
            return (
                <View style={this.props.styles.container}>
                    {this.state.showOptions
                        ? this.renderOptions()
                        : this.state.showRecoverWithPublicKey
                        ? this.renderRecoverPublicKey()
                        : this.renderRecoverMoonlet()}
                </View>
            );
        }
    }
}

export const RecoverNearAccountScreen = smartConnect<IExternalProps>(RecoverNearAccountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
