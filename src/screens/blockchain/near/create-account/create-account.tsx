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
import { createNearAccount } from '../../../../redux/wallets/actions';
import { IReduxState } from '../../../../redux/state';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { Client as NearClient } from '../../../../core/blockchain/near/client';
import { getChainId } from '../../../../redux/preferences/selectors';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import {
    INavigationProps,
    withNavigationParams
} from '../../../../navigation/with-navigation-params';
import { NEAR_TLD } from '../../../../core/constants/app';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../../../core/utils/format-number';
import {
    CREATE_ACCOUNT_NEAR_DEPOSIT,
    CREATE_ACCOUNT_NEAR_FEES,
    NEAR_CREATE_ACCOUNT_MIN_BALANCE
} from '../../../../core/blockchain/near/consts';
import { getSelectedAccount } from '../../../../redux/wallets/selectors';
import { IAccountState } from '../../../../redux/wallets/state';
import BN from 'bn.js';

interface INavigationParams {
    accountId?: string;
}

interface IReduxProps {
    createNearAccount: typeof createNearAccount;
    chainId: ChainIdType;
    selectedAccount: IAccountState;
}

interface IState {
    inputAccount: string;
    isInputValid: boolean;
    isChecking: boolean;
    isUsernameNotAvailable: boolean;
    isInvalidUsername: boolean;
    nearFees: string;
    depositAmount: string;
    nearCreateAccountFees: string;
    insufficientFunds: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        chainId: getChainId(state, Blockchain.NEAR),
        selectedAccount: getSelectedAccount(state)
    };
};

const mapDispatchToProps = {
    createNearAccount
};

const navigationOptions = () => ({ title: translate('CreateNearAccount.title') });

export class CreateNearAccountComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            inputAccount: props.accountId || '',
            isInputValid: false,
            isChecking: false,
            isUsernameNotAvailable: false,
            isInvalidUsername: false,
            nearFees: undefined,
            depositAmount: undefined,
            nearCreateAccountFees: undefined,
            insufficientFunds: false
        };
    }

    public componentDidMount() {
        if (this.state.inputAccount !== '') {
            this.checkAccountId(this.state.inputAccount);
        }

        const blockchainInstance = getBlockchain(Blockchain.NEAR);

        const balance = this.props.selectedAccount.tokens[this.props.chainId][
            blockchainInstance.config.coin
        ].balance.value;

        if (
            new BigNumber(balance).isLessThan(
                new BigNumber(NEAR_CREATE_ACCOUNT_MIN_BALANCE.toString())
            )
        ) {
            this.getNearFees('nearCreateAccountFees', NEAR_CREATE_ACCOUNT_MIN_BALANCE);
            this.setState({ insufficientFunds: true });
        }

        this.getNearFees('nearFees', CREATE_ACCOUNT_NEAR_FEES);
        this.getNearFees('depositAmount', CREATE_ACCOUNT_NEAR_DEPOSIT);
    }

    private getNearFees(name: string, fee: BN) {
        const blockchainInstance = getBlockchain(Blockchain.NEAR);

        const feeAmount = blockchainInstance.account.amountFromStd(
            new BigNumber(fee.toString()),
            getTokenConfig(Blockchain.NEAR, Blockchain.NEAR).decimals
        );
        const formatedAmount: string = formatNumber(new BigNumber(feeAmount), {
            currency: blockchainInstance.config.coin
        });
        // @ts-ignore
        this.setState({ [name]: formatedAmount });
    }

    private async checkAccountId(accountId: string) {
        this.setState({
            inputAccount: accountId,
            isChecking: true
        });

        if (accountId.includes('.') || accountId.includes('@')) {
            this.setState({
                isInputValid: false,
                isInvalidUsername: true,
                isUsernameNotAvailable: false,
                isChecking: false
            });
            return;
        }

        try {
            const blockchainInstance = getBlockchain(Blockchain.NEAR);
            const client = blockchainInstance.getClient(this.props.chainId) as NearClient;

            const account = await client.getAccount(`${accountId}.${NEAR_TLD[this.props.chainId]}`);

            if (account.exists === false && account.valid === true) {
                this.setState({
                    isInputValid: true,
                    isInvalidUsername: false,
                    isUsernameNotAvailable: false,
                    isChecking: false
                });
            } else {
                this.setState({
                    isInputValid: false,
                    isInvalidUsername: false,
                    isUsernameNotAvailable: true,
                    isChecking: false
                });
            }
        } catch (error) {
            this.setState({
                isInputValid: false,
                isInvalidUsername: false,
                isUsernameNotAvailable: true,
                isChecking: false
            });
        }
    }

    private async createAccount() {
        try {
            const password = await PasswordModal.getPassword();
            this.props.createNearAccount(
                this.state.inputAccount,
                NEAR_TLD[this.props.chainId],
                password
            );
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    public render() {
        const { styles, theme } = this.props;
        const { insufficientFunds } = this.state;

        const isChecking = this.state.isChecking && !this.state.isInputValid;
        const isUsernameNotAvailable =
            this.state.isUsernameNotAvailable && !this.state.isInputValid;
        const isInvalidUsername = this.state.isInvalidUsername && !this.state.isInputValid;

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

                        <Text style={styles.chooseUsernameText}>
                            {translate('CreateNearAccount.chooseAccountName')}
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
                                    value={this.state.inputAccount}
                                    onChangeText={inputAccount => this.checkAccountId(inputAccount)}
                                    editable={!insufficientFunds}
                                />

                                <Text style={styles.domain}>
                                    {`.${NEAR_TLD[this.props.chainId]}`}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.infoText,
                                    insufficientFunds && styles.errorText,
                                    isUsernameNotAvailable && styles.errorText,
                                    isInvalidUsername && styles.errorText,
                                    isChecking && styles.checkingText,

                                    this.state.isInputValid && styles.congratsText
                                ]}
                            >
                                {insufficientFunds
                                    ? translate('CreateNearAccount.insufficientFunds', {
                                          amount: this.state.nearCreateAccountFees
                                      })
                                    : isChecking
                                    ? translate('AddAccount.checking')
                                    : isUsernameNotAvailable
                                    ? translate('AddAccount.notAvailable')
                                    : isInvalidUsername
                                    ? translate('AddAccount.invalid')
                                    : this.state.isInputValid
                                    ? translate('CreateNearAccount.congrats', {
                                          name: `${this.state.inputAccount}.${
                                              NEAR_TLD[this.props.chainId]
                                          }`,
                                          nearFees: this.state.nearFees,
                                          depositAmount: this.state.depositAmount
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
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export const CreateNearAccountScreen = smartConnect(CreateNearAccountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
