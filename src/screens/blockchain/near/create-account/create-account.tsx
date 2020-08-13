import React from 'react';
import { Image, View, TextInput } from 'react-native';
import { Text, Button } from '../../../../library';
import stylesProvider from './styles';
import { Blockchain, ChainIdType } from '../../../../core/blockchain/types';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
// import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { createAccount, addAccount } from '../../../../redux/wallets/actions';
import { IReduxState } from '../../../../redux/state';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
// import { Client as NearClient } from '../../../../core/blockchain/near/client';
import { getChainId } from '../../../../redux/preferences/selectors';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { INavigationProps } from '../../../../navigation/with-navigation-params';

export interface IReduxProps {
    createAccount: typeof createAccount;
    chainId: ChainIdType;
    addAccount: typeof addAccount;
}

export interface IState {
    inputAccout: string;
    isInputValid: boolean;
    isChecking: boolean;
    isUsernameNotAvailable: boolean;
    isInvalidUsername: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        chainId: getChainId(state, Blockchain.NEAR)
    };
};

const mapDispatchToProps = {
    createAccount,
    addAccount
};

export const navigationOptions = () => ({ title: translate('CreateNearAccount.title') });

export class CreateNearAccountComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            inputAccout: '',
            isInputValid: false,
            isChecking: false,
            isUsernameNotAvailable: false,
            isInvalidUsername: false
        };
    }

    public async checkAccountIdValid() {
        // TODO

        // const blockchainInstance = getBlockchain(Blockchain.NEAR);
        // const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

        try {
            // const account = await client.getAccount(this.state.inputAccout);
            // if (account.exists === true && account.valid === true) {
            //     this.setState({
            //         isInputValid: false,
            //         showInputInfo: true,
            //         errorMessage: translate('CreateNearAccount.taken')
            //     });
            // } else if (account.exists === false && account.valid === false) {
            //     this.setState({
            //         isInputValid: false,
            //         showInputInfo: true,
            //         errorMessage: translate('CreateNearAccount.invalid')
            //     });
            // } else {
            //     this.setState({
            //         isInputValid: true,
            //         showInputInfo: true
            //     });
            // }
        } catch (error) {
            // this.setState({ isInputValid: false, showInputInfo: true });
        }
    }

    private async createAccount() {
        try {
            const password = await PasswordModal.getPassword();
            // start loading
            // this.setState({ isLoading: true });
            this.props.createAccount(
                Blockchain.NEAR,
                `${this.state.inputAccout}.novi.testnet`,
                password
            );
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    public render() {
        const { styles, theme } = this.props;

        const isChecking = this.state.isChecking && !this.state.isInputValid;
        const isUsernameNotAvailable =
            this.state.isUsernameNotAvailable && !this.state.isInputValid;
        const isInvalidUsername = this.state.isInvalidUsername && !this.state.isInputValid;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Image
                        source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                        style={styles.moonletImage}
                    />

                    <Text style={styles.chooseUsernameText}>
                        {translate('CreateNearAccount.chooseUsername')}
                    </Text>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.inputText}
                                placeholderTextColor={theme.colors.textTertiary}
                                placeholder={translate('CreateNearAccount.eg')}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                selectionColor={theme.colors.accent}
                                returnKeyType="done"
                                value={this.state.inputAccout}
                                onChangeText={inputAccout =>
                                    this.setState({
                                        inputAccout
                                    })
                                }
                            />

                            <Text style={styles.domain}>{'.novi.testnet'}</Text>
                        </View>

                        <Text
                            style={[
                                styles.infoText,
                                isChecking && styles.checkingText,
                                isUsernameNotAvailable && styles.errorText,
                                isInvalidUsername && styles.errorText,
                                this.state.isInputValid && styles.congratsText
                            ]}
                        >
                            {isChecking
                                ? translate('CreateNearAccount.checking')
                                : isUsernameNotAvailable
                                ? translate('CreateNearAccount.notAvailable')
                                : isInvalidUsername
                                ? translate('CreateNearAccount.invalid')
                                : this.state.isInputValid
                                ? translate('CreateNearAccount.congrats', {
                                      name: this.state.inputAccout
                                  })
                                : ''}
                        </Text>
                    </View>
                </View>

                <Button
                    wrapperStyle={styles.createButton}
                    primary
                    disabled={!this.state.isInputValid}
                    onPress={() => this.createAccount()}
                >
                    {translate('CreateNearAccount.title')}
                </Button>
            </View>
        );
    }
}

export const CreateNearAccountScreen = smartConnect(CreateNearAccountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
