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
import { createNearAccount } from '../../redux/wallets/actions';
import { IReduxState } from '../../redux/state';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    createNearAccount: typeof createNearAccount;
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
    createNearAccount
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
            isLoading: false
        };
    }

    public checkAccountIdValid = async () => {
        const blockchainInstance = getBlockchain(this.props.blockchain);

        const isInputValid = await blockchainInstance
            .getClient(0) // TODO: chainId
            .checkAccountIdValid(this.state.inputAccout);

        this.setState({ isInputValid, showInputInfo: true });

        if (isInputValid) {
            this.setState({ isCreate: true });
        }
    };

    public createAccount = async () => {
        this.setState({ isLoading: true });
        await this.props.createNearAccount(this.props.blockchain, this.state.inputAccout);
    };

    public render() {
        const { styles, theme } = this.props;

        if (this.state.isLoading) {
            return <LoadingIndicator />;
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.createText}>{translate('NearCreateAccount.create')}</Text>
                    <Text style={styles.chooseUsernameText}>
                        {translate('NearCreateAccount.chooseUsername')}
                    </Text>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={theme.colors.textTertiary}
                                placeholder={translate('NearCreateAccount.eg')}
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
                                {translate('NearCreateAccount.congrats')}
                            </Text>
                        )}

                        {!this.state.isInputValid && this.state.showInputInfo && (
                            <Text style={styles.invalidText}>
                                {translate('NearCreateAccount.invalidUsername')}
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
                </View>
            );
        }
    }
}

export const AccountCreate = smartConnect<IExternalProps>(AccountCreateComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
