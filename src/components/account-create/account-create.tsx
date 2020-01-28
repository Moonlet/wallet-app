import React from 'react';
import { View, TextInput } from 'react-native';
import { Text, Button } from '../../library';
import { ITheme } from '../../core/theme/itheme';
import stylesProvider from './styles';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Blockchain } from '../../core/blockchain/types';
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

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    createAccount: typeof createAccount;
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

const mapStateToProps = (state: IReduxState) => {
    return {};
};

const mapDispatchToProps = {
    createAccount
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

    public checkAccountIdValid = async () => {
        if (this.props.blockchain === Blockchain.NEAR) {
            const blockchainInstance = getBlockchain(this.props.blockchain);

            const client = blockchainInstance.getClient(0) as NearClient;
            const isInputValid = await client.checkAccountIdValid(this.state.inputAccout);

            this.setState({ isInputValid, showInputInfo: true });

            if (isInputValid) {
                this.setState({ isCreate: true });
            }
        }
    };

    public createAccount = async () => {
        const password = await this.passwordModal.requestPassword();
        this.setState({ isLoading: true });
        this.props.createAccount(this.props.blockchain, this.state.inputAccout, password);
    };

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
                                    this.setState({ inputAccout, showInputInfo: false })
                                }
                            />
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
