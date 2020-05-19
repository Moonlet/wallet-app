import React from 'react';
import { View, TextInput } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { translate } from '../../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { formatAddress } from '../../../core/utils/format-address';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { BottomCta } from '../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import { Text } from '../../../library';
import {
    IWalletState,
    IAccountState,
    ITokenState,
    IWalletsState
} from '../../../redux/wallets/state';
import { IReduxState } from '../../../redux/state';
import { getSelectedWallet, getSelectedAccount } from '../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { Amount } from '../../../components/amount/amount';
import { calculateBalance } from '../../../core/utils/balance';
import { ChainIdType, IFeeOptions } from '../../../core/blockchain/types';
import { IExchangeRates } from '../../../redux/market/state';
import { getChainId } from '../../../redux/preferences/selectors';
import { FeeOptions } from '../../send/components/fee-options/fee-options';
import { BASE_DIMENSION, normalize } from '../../../styles/dimensions';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { BottomSheetType } from '../../../redux/ui/bottomSheet/state';
import { openBottomSheet } from '../../../redux/ui/bottomSheet/actions';
import { Icon } from '../../../components/icon';
import { setNetworkTestNetChainId, toggleTestNet } from '../../../redux/preferences/actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export interface IQRCodeTxPayload {
    address: string;
    chainId: ChainIdType;
    fct: string; // ex: /Transfer /DoMagic
    params: {
        amount?: string;
        gasPrice?: string;
        gasLimit?: string;
    };
}

export interface IExternalProps {
    qrCodeTxPayload: IQRCodeTxPayload;
    callback: () => void;
    errorToken: (tokenSymbol: string) => void;
}

export interface IReduxProps {
    wallets: IWalletsState;
    wallet: IWalletState;
    selectedAccount: IAccountState;
    chainId: ChainIdType;
    exchangeRates: IExchangeRates;
    openBottomSheet: typeof openBottomSheet;
    setNetworkTestNetChainId: typeof setNetworkTestNetChainId;
    toggleTestNet: typeof toggleTestNet;
    isTestNet: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        wallets: state.wallets,
        wallet: getSelectedWallet(state),
        selectedAccount,
        chainId: getChainId(state, selectedAccount.blockchain),
        exchangeRates: state.market.exchangeRates,
        isTestNet: state.preferences.testNet
    };
};

const mapDispatchToProps = {
    openBottomSheet,
    setNetworkTestNetChainId,
    toggleTestNet
};

interface IState {
    amount: string;
    chainId: ChainIdType;
    tokenSymbol: string;
    insufficientFunds: boolean;
    insufficientFundsFees: boolean;
}

export class QRCodeTransferRequestComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        const tokenSymbol: string = undefined; // 'XSGD';
        const config = getBlockchain(props.selectedAccount.blockchain).config;

        this.state = {
            amount: '0',
            chainId: props.qrCodeTxPayload?.chainId ? props.qrCodeTxPayload.chainId : props.chainId,
            tokenSymbol:
                tokenSymbol !== undefined
                    ? tokenSymbol // ZRC-2
                    : config.coin, // Default Native Coin
            insufficientFunds: false,
            insufficientFundsFees: false
        };
    }

    public componentDidMount() {
        const { blockchain } = this.props.selectedAccount;

        // TODO
        // Validate chainId
        // ZRC-2: Make sure you have the token on that chainId

        if (this.props.chainId) {
            if (this.props.isTestNet === false) {
                // Activate TestNet
                this.props.toggleTestNet();
            }
            this.props.setNetworkTestNetChainId(blockchain, this.props.chainId);
        }

        if (this.props.qrCodeTxPayload?.params?.amount) {
            const tokenConfig = getTokenConfig(
                this.props.selectedAccount.blockchain,
                this.state.tokenSymbol
            );

            const amountFromStd = getBlockchain(blockchain).account.amountFromStd(
                new BigNumber(this.props.qrCodeTxPayload.params.amount),
                tokenConfig.decimals
            );

            this.setState({ amount: amountFromStd.toString() });
        }
    }

    private renderField(
        label: string,
        value: string,
        options?: { amount?: string; inputColor?: string; leftIcon?: string }
    ) {
        const { styles, theme } = this.props;

        let tokenConfig;
        let blockchain;

        if (options?.amount) {
            blockchain = this.props.selectedAccount.blockchain;

            tokenConfig = getTokenConfig(blockchain, this.state.tokenSymbol);
        }

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.receipientLabel}>{label}</Text>
                <View style={styles.inputBox}>
                    {options?.amount ? (
                        <Amount
                            style={styles.confirmTransactionText}
                            amount={options.amount}
                            token={tokenConfig.symbol}
                            tokenDecimals={tokenConfig.decimals}
                            blockchain={blockchain}
                        />
                    ) : (
                        <Text
                            style={[
                                styles.confirmTransactionText,
                                {
                                    color: options?.inputColor
                                        ? options.inputColor
                                        : theme.colors.textSecondary
                                }
                            ]}
                        >
                            {value}
                        </Text>
                    )}
                    {options?.leftIcon && (
                        <Icon
                            name={options.leftIcon}
                            size={normalize(16)}
                            style={styles.leftIcon}
                        />
                    )}
                </View>
            </View>
        );
    }

    private renderInputAmountField(label: string) {
        const { theme, styles } = this.props;

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.receipientLabel}>{label}</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputText}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Send.amount')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.amount}
                        onChangeText={(text: any) => this.setState({ amount: text })}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        // TODO: maxLength - max 8 decimals: 0.00000000
                    />
                </View>
            </View>
        );
    }

    private getWalletsByToken(tokenSymbol: string): IWalletState[] {
        const walletsByToken: IWalletState[] = [];

        Object.values(this.props.wallets).map((wallet: IWalletState) => {
            wallet.accounts.map((account: IAccountState) => {
                Object.keys(account.tokens).map((chainId: ChainIdType) => {
                    Object.keys(account.tokens[chainId]).map((symbol: string) => {
                        const token: ITokenState = account.tokens[chainId][symbol];

                        if (token.symbol === tokenSymbol) {
                            walletsByToken.push(wallet);
                        }
                    });
                });
            });
        });

        return walletsByToken;
    }

    public render() {
        const { qrCodeTxPayload, styles, theme, selectedAccount } = this.props;
        const { amount, chainId, tokenSymbol } = this.state;
        const { blockchain } = selectedAccount;

        const recipient = formatAddress(qrCodeTxPayload.address, blockchain);

        const config = getBlockchain(blockchain).config;

        const token = selectedAccount.tokens[chainId][config.coin];
        // TODO: sendingToken

        const tokenConfig = getTokenConfig(blockchain, tokenSymbol);

        const stdAmount = getBlockchain(blockchain).account.amountToStd(
            new BigNumber(amount),
            tokenConfig.decimals
        );

        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <TouchableHighlight
                        onPress={() => {
                            this.props.openBottomSheet(BottomSheetType.WALLETS, {
                                wallets: this.getWalletsByToken(tokenSymbol)
                            });
                        }}
                        underlayColor={theme.colors.appBackground}
                    >
                        {this.renderField(
                            translate('TransactionRequest.walletName'),
                            this.props.wallet.name,
                            { inputColor: theme.colors.text, leftIcon: 'chevron-down' }
                        )}
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={() => {
                            this.props.openBottomSheet(BottomSheetType.ACCOUNTS, { blockchain });
                        }}
                        underlayColor={theme.colors.appBackground}
                    >
                        {this.renderField(
                            translate('TransactionRequest.accountName'),
                            selectedAccount.name || `Account ${selectedAccount.index + 1}`,
                            { inputColor: theme.colors.text, leftIcon: 'chevron-down' }
                        )}
                    </TouchableHighlight>

                    {this.renderField(translate('App.labels.balance'), undefined, {
                        amount: calculateBalance(
                            this.props.selectedAccount,
                            this.state.chainId,
                            this.props.exchangeRates
                        )
                    })}

                    {this.renderField(
                        translate('App.labels.from'),
                        formatAddress(this.props.selectedAccount.address, blockchain)
                    )}
                    {this.renderField(translate('App.labels.recipient'), recipient)}

                    {this.renderInputAmountField(
                        `${translate('App.labels.amount')} (${tokenSymbol})`
                    )}

                    {this.state.insufficientFunds && (
                        <Text style={styles.insufficientFunds}>
                            {translate('TransactionRequest.insufficientFunds')}
                        </Text>
                    )}

                    <FeeOptions
                        token={token}
                        sendingToken={token} // TODO
                        account={this.props.selectedAccount}
                        toAddress={qrCodeTxPayload.address}
                        onFeesChanged={(feeOptions: IFeeOptions) => {
                            // TODO
                            // this.onFeesChanged(feeOptions);
                        }}
                        insufficientFundsFees={this.state.insufficientFundsFees}
                        options={{
                            feeTotalBackgroundColor: theme.colors.inputBackground,
                            feeLabelLeftPadding: BASE_DIMENSION
                        }}
                    />
                </KeyboardAwareScrollView>

                <BottomCta
                    label={translate('App.labels.confirm')}
                    disabled={qrCodeTxPayload === undefined}
                    onPress={() => this.props.callback()}
                >
                    <PrimaryCtaField
                        label={translate('App.labels.send')}
                        action={translate('App.labels.to')}
                        value={recipient}
                    />
                    <AmountCtaField
                        tokenConfig={tokenConfig}
                        stdAmount={stdAmount}
                        account={selectedAccount}
                    />
                </BottomCta>
            </View>
        );
    }
}

export const QRCodeTransferRequest = smartConnect<IExternalProps>(QRCodeTransferRequestComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
