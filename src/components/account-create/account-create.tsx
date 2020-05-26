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
import { createAccount } from '../../redux/wallets/actions';
import { IReduxState } from '../../redux/state';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { PasswordModal } from '../password-modal/password-modal';
import { Client as NearClient } from '../../core/blockchain/near/client';
import { Icon } from '../icon/icon';
import { getChainId } from '../../redux/preferences/selectors';
import { normalize } from '../../styles/dimensions';
import { IconValues } from '../icon/values';

export interface IReduxProps {
    createAccount: typeof createAccount;
    chainId: ChainIdType;
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
    errorMessage: string;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    createAccount
};

export class AccountCreateComponent extends React.Component<
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
            isCreate: false,
            isLoading: false,
            errorMessage: undefined
        };
    }

    public checkAccountIdValid = async () => {
        if (this.props.blockchain === Blockchain.NEAR) {
            const blockchainInstance = getBlockchain(this.props.blockchain);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            try {
                const account = await client.getAccount(this.state.inputAccout);

                if (account.exists === true && account.valid === true) {
                    this.setState({
                        isCreate: false,
                        isInputValid: false,
                        showInputInfo: true,
                        errorMessage: translate('CreateAccount.taken')
                    });
                } else if (account.exists === false && account.valid === false) {
                    this.setState({
                        isCreate: false,
                        isInputValid: false,
                        showInputInfo: true,
                        errorMessage: translate('CreateAccount.invalid')
                    });
                } else {
                    this.setState({
                        isCreate: true,
                        isInputValid: true,
                        showInputInfo: true
                    });
                }
            } catch (error) {
                this.setState({ isInputValid: false, showInputInfo: true });
            }
        }
    };

    public createAccount = async () => {
        const password = await PasswordModal.getPassword();
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
        const isSuccess = this.state.isInputValid && this.state.showInputInfo;
        const isErrorMessage = !this.state.isInputValid && this.state.showInputInfo;

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
                                    <Icon
                                        name={IconValues.CLOSE}
                                        size={normalize(16)}
                                        style={styles.icon}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text
                            style={[
                                isSuccess && styles.congratsText,
                                isErrorMessage && styles.invalidText
                            ]}
                        >
                            {isSuccess
                                ? translate('CreateAccount.congrats')
                                : isErrorMessage
                                ? translate('CreateAccount.errorMessage', {
                                      message: this.state.errorMessage
                                  })
                                : ''}
                        </Text>
                    </View>

                    <Button
                        style={styles.createButton}
                        primary
                        disabled={
                            this.state.inputAccout.length === 0 ||
                            (this.state.isCreate &&
                                this.state.isInputValid === false &&
                                this.state.showInputInfo)
                        }
                        onPress={() => {
                            if (this.state.isCreate) {
                                // create account
                                this.createAccount();
                            } else {
                                // check is account name is valid (not already taken)
                                this.checkAccountIdValid();
                            }
                        }}
                    >
                        {this.state.isCreate
                            ? translate('App.labels.create')
                            : translate('App.labels.check')}
                    </Button>
                </View>
            );
        }
    }
}

export const AccountCreate = smartConnect<IExternalProps>(AccountCreateComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
