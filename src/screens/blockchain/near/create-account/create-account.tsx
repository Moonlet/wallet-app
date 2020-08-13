import React from 'react';
import { Image, View, TextInput } from 'react-native';
import { Text, Button } from '../../../../library';
import stylesProvider from './styles';
import { Blockchain, ChainIdType } from '../../../../core/blockchain/types';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { createNearAccount, addAccount } from '../../../../redux/wallets/actions';
import { IReduxState } from '../../../../redux/state';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { Client as NearClient } from '../../../../core/blockchain/near/client';
import { getChainId } from '../../../../redux/preferences/selectors';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { INavigationProps } from '../../../../navigation/with-navigation-params';

const MASTER_ACCOUNT = 'novi.testnet';

export interface IReduxProps {
    createNearAccount: typeof createNearAccount;
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
    createNearAccount,
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

    private async checkAccountId(accountId: string) {
        this.setState({
            inputAccout: accountId,
            isChecking: true
        });

        if (accountId.includes('.') || accountId.includes('@')) {
            this.setState({
                isInputValid: false,
                isInvalidUsername: true,
                isChecking: false
            });
            return;
        }

        try {
            const blockchainInstance = getBlockchain(Blockchain.NEAR);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            const account = await client.getAccount(`${accountId}.${MASTER_ACCOUNT}`);

            if (account.exists === false && account.valid === true) {
                this.setState({
                    isInputValid: true,
                    isChecking: false
                });
            } else {
                this.setState({
                    isInputValid: false,
                    isUsernameNotAvailable: true,
                    isChecking: false
                });
            }
        } catch (error) {
            this.setState({
                isInputValid: false,
                isUsernameNotAvailable: true,
                isChecking: false
            });
        }
    }

    private async createAccount() {
        try {
            const password = await PasswordModal.getPassword();
            this.props.createNearAccount(`${this.state.inputAccout}.${MASTER_ACCOUNT}`, password);
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
                                onChangeText={inputAccout => this.checkAccountId(inputAccout)}
                            />

                            <Text style={styles.domain}>{`.${MASTER_ACCOUNT}`}</Text>
                        </View>

                        <Text
                            style={[
                                styles.infoText,
                                isUsernameNotAvailable && styles.errorText,
                                isInvalidUsername && styles.errorText,
                                isChecking && styles.checkingText,

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
                                      name: `${this.state.inputAccout}.${MASTER_ACCOUNT}`
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
