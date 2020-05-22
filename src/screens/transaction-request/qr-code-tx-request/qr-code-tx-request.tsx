import React from 'react';
import { View, TextInput, TouchableHighlight } from 'react-native';
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
import { ChainIdType, IFeeOptions } from '../../../core/blockchain/types';
import { IExchangeRates } from '../../../redux/market/state';
import { getChainId } from '../../../redux/preferences/selectors';
import { FeeOptions } from '../../send/components/fee-options/fee-options';
import { BASE_DIMENSION, normalize } from '../../../styles/dimensions';
import { BottomSheetType } from '../../../redux/ui/bottomSheet/state';
import { openBottomSheet } from '../../../redux/ui/bottomSheet/actions';
import { Icon } from '../../../components/icon';
import { setNetworkTestNetChainId, toggleTestNet } from '../../../redux/preferences/actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ITokensConfigState, ITokenConfigState } from '../../../redux/tokens/state';
import { availableFunds, availableAmount } from '../../../core/utils/available-funds';
import CONFIG from '../../../config';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';
import bind from 'bind-decorator';

export interface IQRCodeTxPayload {
    address: string;
    chainId: ChainIdType;
    fct: string; // ex: /Transfer /DoMagic /proxyTransfer
    params: {
        amount?: string;
        amountUint128?: string;
        gasPrice?: string; // TODO
        gasLimit?: string; // TODO
        ByStr20To?: string;
    };
}

export interface IQRCodeTransferData {
    account: IAccountState;
    toAddress: string;
    amount: string;
    token: string;
    feeOptions: IFeeOptions;
}

export interface IExternalProps {
    qrCodeTxPayload: IQRCodeTxPayload;
    callback: (options?: { qrCodeTransferData?: IQRCodeTransferData }) => void;
    showError: (options?: { tokenNotFound?: boolean; tokenSymbol?: string }) => void;
}

export interface IReduxProps {
    wallets: IWalletsState;
    wallet: IWalletState;
    selectedAccount: IAccountState;
    currentChainId: ChainIdType;
    exchangeRates: IExchangeRates;
    openBottomSheet: typeof openBottomSheet;
    setNetworkTestNetChainId: typeof setNetworkTestNetChainId;
    toggleTestNet: typeof toggleTestNet;
    isTestNet: boolean;
    tokens: ITokensConfigState;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        wallets: state.wallets,
        wallet: getSelectedWallet(state),
        selectedAccount,
        currentChainId: getChainId(state, selectedAccount.blockchain),
        exchangeRates: state.market.exchangeRates,
        isTestNet: state.preferences.testNet,
        tokens: state.tokens
    };
};

const mapDispatchToProps = {
    openBottomSheet,
    setNetworkTestNetChainId,
    toggleTestNet
};

interface IState {
    toAddress: string;
    amount: string;
    chainId: ChainIdType;
    tokenSymbol: string;
    insufficientFunds: boolean;
    insufficientFundsFees: boolean;
    feeOptions: IFeeOptions;
    token: ITokenState;
    isLoading: boolean;
}

export class QRCodeTransferRequestComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            toAddress: '',
            amount: '0',
            chainId: props.currentChainId,
            tokenSymbol: getBlockchain(props.selectedAccount.blockchain).config.coin, // Default Native Coin
            insufficientFunds: false,
            insufficientFundsFees: false,
            feeOptions: undefined,
            token: undefined,
            isLoading: false
        };
    }

    public componentDidMount() {
        this.parseQrCodeTxPayload();
    }

    public componentDidUpdate(prevProps: IReduxProps & IExternalProps) {
        if (this.props.qrCodeTxPayload !== prevProps.qrCodeTxPayload) {
            this.reinitState();
        }
    }

    private reinitState() {
        this.setState(
            {
                amount: '0',
                chainId: this.props.currentChainId,
                tokenSymbol: getBlockchain(this.props.selectedAccount.blockchain).config.coin, // Default Native Coin
                insufficientFunds: false,
                insufficientFundsFees: false,
                feeOptions: undefined,
                token: undefined,
                isLoading: false
            },
            () => this.parseQrCodeTxPayload()
        );
    }

    public async parseQrCodeTxPayload() {
        const { blockchain } = this.props.selectedAccount;
        const { qrCodeTxPayload } = this.props;
        const blockchainInstance = getBlockchain(blockchain);

        this.setState({ isLoading: true });

        if (qrCodeTxPayload?.chainId) {
            if (this.isChainIdValid(qrCodeTxPayload.chainId)) {
                // Valid ChainId
                // Set the ChainId of the user with the received one
                this.props.setNetworkTestNetChainId(blockchain, Number(qrCodeTxPayload.chainId));

                // Activate testnet if disabled
                if (this.props.isTestNet === false) {
                    // Activate TestNet
                    this.props.toggleTestNet();
                }

                this.setState({ chainId: qrCodeTxPayload.chainId });
            } else {
                // Invalid ChainId
                this.props.showError();
                return; // Show error, no need to continue anymore
            }
        }

        if (qrCodeTxPayload?.fct === '/proxyTransfer') {
            await this.proxyTransfer();

            if (this.getWalletsByToken(this.state.tokenSymbol).length === 0) {
                // Token has not been found in any wallet
                this.props.showError({ tokenNotFound: true, tokenSymbol: this.state.tokenSymbol });
                return; // Show error, no need to continue anymore
            }
        } else {
            this.getAccountTokenBySymbol(this.state.tokenSymbol);
        }

        let amount: string;
        if (qrCodeTxPayload?.params?.amount) {
            amount = qrCodeTxPayload.params.amount;
        }

        // Amount Uint-128 is prioritary
        if (qrCodeTxPayload?.params?.amountUint128) {
            amount = qrCodeTxPayload.params.amountUint128;
        }

        if (amount) {
            const tokenConfig = getTokenConfig(blockchain, this.state.tokenSymbol);

            const amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(amount),
                tokenConfig.decimals
            );

            this.setState({ amount: amountFromStd.toFixed() });
        }

        const toAddress = qrCodeTxPayload.params?.ByStr20To
            ? qrCodeTxPayload.params.ByStr20To
            : qrCodeTxPayload.address;

        try {
            await blockchainInstance
                .getClient(qrCodeTxPayload?.chainId || this.state.chainId)
                .nameService.resolveText(toAddress);
        } catch (err) {
            // Invalid address
            this.props.showError();
            return; // Show error, no need to continue anymore
        }

        this.setState({
            toAddress,
            isLoading: false
        });
    }

    private isChainIdValid(chainId: ChainIdType): boolean {
        // Make sure the ChainId is valid
        const { blockchain } = this.props.selectedAccount;

        const networksByChainId = getBlockchain(blockchain).networks.filter(
            n => n.chainId === chainId
        );

        if (networksByChainId.length === 0) {
            // Invalid ChainId
            return false;
        } else {
            // Valid ChainId
            return true;
        }
    }

    private async proxyTransfer() {
        const { qrCodeTxPayload } = this.props;

        const tokenSymbolOnChainId = this.searchTokenByContractAddressAndChainId(
            qrCodeTxPayload.address,
            qrCodeTxPayload?.chainId || this.state.chainId
        );

        if (tokenSymbolOnChainId === undefined) {
            // Token is not on the requested ChainId
            const searchedToken = await this.fetchTokenByContractAddress(qrCodeTxPayload.address);
            this.props.showError({ tokenNotFound: true, tokenSymbol: searchedToken });
        } else {
            this.setState({ tokenSymbol: tokenSymbolOnChainId });
            this.getAccountTokenBySymbol(tokenSymbolOnChainId);
        }
    }

    private async fetchTokenByContractAddress(address: string): Promise<string> {
        let foundTokenSymbol: string;

        try {
            const token = await fetch(
                CONFIG.tokensUrl +
                    `${this.props.selectedAccount.blockchain.toLocaleLowerCase()}/${address.toLocaleLowerCase()}.json`
            );

            const tokenData = await token.json();

            if (tokenData && tokenData?.symbol) {
                foundTokenSymbol = tokenData?.symbol;
            }
        } catch {
            //
        }

        return foundTokenSymbol;
    }

    private searchTokenByContractAddressAndChainId(
        contractAddress: string,
        searchChainId: ChainIdType
    ) {
        const { tokens } = this.props;
        let tokenSymbol;

        Object.keys(tokens).map((blockchain: string) => {
            Object.keys(tokens[blockchain]).map((chainId: ChainIdType) => {
                Object.values(tokens[blockchain][chainId]).map((token: ITokenConfigState) => {
                    if (
                        token?.contractAddress === contractAddress &&
                        Number(chainId) === Number(searchChainId) // TODO
                    ) {
                        tokenSymbol = token?.symbol;
                    }
                });
            });
        });

        return tokenSymbol;
    }

    private renderField(
        label: string,
        value: string,
        options?: { amount?: string; inputColor?: string; leftIcon?: string }
    ) {
        const { styles, theme } = this.props;

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.receipientLabel}>{label}</Text>
                <View style={styles.inputBox}>
                    {options?.amount ? (
                        <Text style={styles.confirmTransactionText}>
                            {`${options.amount} ${this.state.tokenSymbol}`}
                        </Text>
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
                        onChangeText={this.addAmount}
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
            const accountsFilteredList = wallet.accounts.filter((account: IAccountState) => {
                const symbolListFiltered = Object.keys(
                    (account?.tokens || {})[this.state.chainId] || {}
                ).filter((symbol: string) => {
                    const token: ITokenState = account.tokens[this.state.chainId][symbol];

                    if (token.symbol === tokenSymbol) {
                        return symbol;
                    }
                });

                if (symbolListFiltered.length > 0) {
                    return account;
                }
            });

            if (accountsFilteredList.length > 0) {
                walletsByToken.push(wallet);
            }
        });

        return walletsByToken;
    }

    private getAccountTokenBySymbol(tokenSymbol: string) {
        const tokens = this.props.selectedAccount.tokens;
        let foundToken: ITokenState;

        Object.keys(tokens).map((chainId: ChainIdType) => {
            Object.values(tokens[chainId]).map((token: ITokenState) => {
                if (
                    token.symbol === tokenSymbol &&
                    Number(chainId) === Number(this.state.chainId) // TODO
                ) {
                    foundToken = token;
                }
            });
        });

        this.setState({ token: foundToken });
    }

    @bind
    private onFeesChanged(feeOptions: IFeeOptions) {
        this.setState({ feeOptions }, () => {
            if (this.state.token) {
                const { insufficientFunds, insufficientFundsFees } = availableFunds(
                    this.state.amount,
                    this.props.selectedAccount,
                    this.state.token,
                    this.state.chainId,
                    feeOptions
                );

                this.setState({ insufficientFunds, insufficientFundsFees });
            }
        });
    }

    @bind
    private addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        this.setState({ amount }, () => {
            if (this.state.token) {
                const { insufficientFunds, insufficientFundsFees } = availableFunds(
                    amount,
                    this.props.selectedAccount,
                    this.state.token,
                    this.state.chainId,
                    this.state.feeOptions
                );

                this.setState({ insufficientFunds, insufficientFundsFees });
            }
        });
    }

    public render() {
        const { qrCodeTxPayload, styles, theme, selectedAccount } = this.props;
        const { amount, chainId, tokenSymbol } = this.state;
        const { blockchain } = selectedAccount;

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <LoadingIndicator />
                </View>
            );
        }

        const recipient = formatAddress(this.state.toAddress, blockchain);

        const config = getBlockchain(blockchain).config;

        const token =
            selectedAccount.tokens[chainId] && selectedAccount.tokens[chainId][config.coin];

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

                    {this.state.token !== undefined &&
                        this.renderField(translate('App.labels.balance'), undefined, {
                            amount: availableAmount(selectedAccount, this.state.token)
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
                        onFeesChanged={this.onFeesChanged}
                        insufficientFundsFees={this.state.insufficientFundsFees}
                        options={{
                            feeTotalBackgroundColor: theme.colors.inputBackground,
                            feeLabelLeftPadding: BASE_DIMENSION
                        }}
                    />
                </KeyboardAwareScrollView>

                <BottomCta
                    label={translate('App.labels.confirm')}
                    disabled={
                        qrCodeTxPayload === undefined ||
                        this.state.insufficientFunds === true ||
                        this.state.insufficientFundsFees === true
                    }
                    onPress={() => {
                        this.props.callback({
                            qrCodeTransferData: {
                                account: this.props.selectedAccount,
                                toAddress: this.state.toAddress,
                                amount: this.state.amount,
                                token: this.state.tokenSymbol,
                                feeOptions: this.state.feeOptions
                            }
                        });
                    }}
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
