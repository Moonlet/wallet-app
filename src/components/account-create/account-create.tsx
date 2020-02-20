import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Text, Button } from '../../library';
import stylesProvider from './styles';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { translate } from '../../core/i18n';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';

import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { createAccount, addAccount, setSelectedAccount } from '../../redux/wallets/actions';
import { IReduxState } from '../../redux/state';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { PasswordModal } from '../password-modal/password-modal';
import { Client as NearClient } from '../../core/blockchain/near/client';
import { Icon } from '../../components/icon';
import { getChainId } from '../../redux/preferences/selectors';
import { WalletFactory } from '../../core/wallet/wallet-factory';
import { getSelectedWallet } from '../../redux/wallets/selectors';
import { IWalletState } from '../../redux/wallets/state';
import { IWallet } from '../../core/wallet/types';
import { Dialog } from '../dialog/dialog';
import { disableCreateAccount } from '../../redux/ui/screens/dashboard/actions';

export interface IReduxProps {
    createAccount: typeof createAccount;
    chainId: ChainIdType;
    selectedWallet: IWalletState;
    addAccount: typeof addAccount;
    setSelectedAccount: typeof setSelectedAccount;
    disableCreateAccount: typeof disableCreateAccount;
}

export interface IExternalProps {
    blockchain: Blockchain;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface IState {
    inputAccout: string;
    isInputValid: boolean;
    showInputInfo: boolean;
    isCreate: boolean;
    isLoading: boolean;
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
    disableCreateAccount
};

export class AccountCreateComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public passwordModal = null;

    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            inputAccout: '',
            isInputValid: false,
            showInputInfo: false,
            isCreate: false,
            isLoading: false
        };
    }

    private recoverAccount = async () => {
        return; // TODO

        const password = await this.passwordModal.requestPassword();

        this.setState({ isLoading: true });

        const blockchain = this.props.blockchain;

        const selectedWallet: IWalletState = this.props.selectedWallet;
        const hdWallet: IWallet = await WalletFactory.get(selectedWallet.id, selectedWallet.type, {
            pass: password
        });

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

            Promise.all(
                publicKeys.map(async publicKey => {
                    const res = await client.recoverAccount(this.state.inputAccout, publicKey);

                    if (res && (res?.permission || res?.nonce)) {
                        found = true;
                        const account = data.find(acc => acc[0].publicKey);
                        const recoverAccount = account[0];
                        recoverAccount.address = this.state.inputAccout;

                        this.props.addAccount(selectedWallet.id, blockchain, recoverAccount);
                        this.props.setSelectedAccount(recoverAccount);
                        this.props.disableCreateAccount();
                    }
                })
            ).then(() => {
                if (!found) {
                    Dialog.info('Error', 'This account cannot be recovered using this wallet.');
                }
            });

            this.setState({ isLoading: false });
        });
    };

    public checkAccountIdValid = async () => {
        if (this.props.blockchain === Blockchain.NEAR) {
            const blockchainInstance = getBlockchain(this.props.blockchain);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            try {
                const account = await client.getAccount(this.state.inputAccout);

                this.setState({ isInputValid: !account.exists, showInputInfo: true });

                if (!account.exists) {
                    this.setState({ isCreate: true });
                }
            } catch (error) {
                this.setState({ isInputValid: false, showInputInfo: true });
            }
        }
    };

    public createAccount = async () => {
        const password = await this.passwordModal.requestPassword();
        this.setState({ isLoading: true });
        this.props.createAccount(this.props.blockchain, this.state.inputAccout, password);
    };

    public onPressClearInput = () =>
        this.setState({
            inputAccout: '',
            isInputValid: false,
            showInputInfo: false,
            isCreate: false,
            isLoading: false
        });

    public render() {
        const { styles, theme } = this.props;

        if (this.state.isLoading) {
            return <LoadingIndicator />;
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.createText}>{translate('CreateAccount.createNear')}</Text>
                    <Text style={styles.chooseUsernameText}>
                        {translate('CreateAccount.chooseUsername')}
                    </Text>

                    <View style={styles.inputContainer}>
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
                                        isCreate: false
                                    })
                                }
                            />
                            {this.state.inputAccout.length !== 0 && (
                                <TouchableOpacity
                                    testID="clear-address"
                                    onPress={this.onPressClearInput}
                                    style={[styles.rightAddressButton]}
                                >
                                    <Icon name="close" size={16} style={styles.icon} />
                                </TouchableOpacity>
                            )}
                        </View>
                        {this.state.isInputValid && this.state.showInputInfo && (
                            <Text style={styles.congratsText}>
                                {translate('CreateAccount.congrats')}
                            </Text>
                        )}

                        {!this.state.isInputValid && this.state.showInputInfo && (
                            <Text style={styles.invalidText}>
                                {translate('CreateAccount.invalidUsername')}
                            </Text>
                        )}
                    </View>

                    <Button
                        style={styles.createButton}
                        primary
                        disabled={this.state.inputAccout.length === 0}
                        onPress={() => {
                            if (this.state.isCreate) {
                                // create account
                                this.createAccount();
                            } else {
                                // check is account name is valid (not already taken)
                                this.checkAccountIdValid();
                            }

                            this.recoverAccount();
                        }}
                    >
                        {this.state.isCreate
                            ? translate('App.labels.create')
                            : translate('App.labels.check')}
                    </Button>

                    <PasswordModal obRef={ref => (this.passwordModal = ref)} />
                </View>
            );
        }
    }
}

export const AccountCreate = smartConnect<IExternalProps>(AccountCreateComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
