import React from 'react';
import { View, TextInput } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { translate } from '../../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { formatAddress } from '../../../core/utils/format-address';
import { formatNumber } from '../../../core/utils/format-number';
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

export interface IExternalProps {
    qrCodeTxPayload: any;
    callback: () => void;
}

export interface IReduxProps {
    wallets: IWalletsState;
    wallet: IWalletState;
    selectedAccount: IAccountState;
    chainId: ChainIdType;
    exchangeRates: IExchangeRates;
    openBottomSheet: typeof openBottomSheet;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        wallets: state.wallets,
        wallet: getSelectedWallet(state),
        selectedAccount,
        chainId: getChainId(state, selectedAccount.blockchain),
        exchangeRates: state.market.exchangeRates
    };
};

const mapDispatchToProps = {
    openBottomSheet
};

interface IState {
    amount: string;
    chainId: ChainIdType;
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
            amount: '',
            chainId: props.chainId
        };
    }

    public componentDidMount() {
        if (this.props.qrCodeTxPayload) {
            const formattedAmount = formatNumber(new BigNumber(this.props.qrCodeTxPayload.amount), {
                currency: getBlockchain(this.props.selectedAccount.blockchain).config.coin
            });

            this.setState({ amount: formattedAmount });
        }
    }

    private renderField(
        label: string,
        value: string,
        options?: { isAmount?: boolean; inputColor?: string; leftIcon?: string }
    ) {
        const { styles, qrCodeTxPayload, theme } = this.props;

        let allBalance;
        let tokenConfig;
        let blockchain;

        if (options?.isAmount) {
            blockchain = this.props.selectedAccount.blockchain;

            tokenConfig = getTokenConfig(blockchain, qrCodeTxPayload.token);

            allBalance =
                this.props.selectedAccount &&
                calculateBalance(
                    this.props.selectedAccount,
                    this.state.chainId,
                    this.props.exchangeRates
                );
        }

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.receipientLabel}>{label}</Text>
                <View style={styles.inputBox}>
                    {options?.isAmount ? (
                        <Amount
                            style={styles.confirmTransactionText}
                            amount={String(allBalance)}
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

    private renderInputField(label: string, key: string) {
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
                        value={key}
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

        const account = qrCodeTxPayload.account;
        const blockchain = account.blockchain;

        const recipient = formatAddress(qrCodeTxPayload.toAddress, blockchain);

        const tokenConfig = getTokenConfig(blockchain, qrCodeTxPayload.token);
        const config = getBlockchain(this.props.selectedAccount.blockchain).config;

        const stdAmount = getBlockchain(blockchain).account.amountToStd(
            new BigNumber(qrCodeTxPayload.amount),
            tokenConfig.decimals
        );

        const token = this.props.selectedAccount.tokens[this.props.chainId][config.coin];
        // TODO: sendingToken

        const wallets = this.getWalletsByToken('XSGD');

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableHighlight
                        onPress={() => {
                            this.props.openBottomSheet(BottomSheetType.WALLETS, { wallets });
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
                        isAmount: true
                    })}

                    {this.renderField(
                        translate('App.labels.from'),
                        formatAddress(this.props.selectedAccount.address, blockchain)
                    )}
                    {this.renderField(translate('App.labels.recipient'), recipient)}

                    {this.renderInputField(translate('App.labels.amount'), this.state.amount)}

                    <FeeOptions
                        token={token}
                        sendingToken={token} // TODO
                        account={this.props.selectedAccount}
                        toAddress={qrCodeTxPayload.toAddress}
                        onFeesChanged={(feeOptions: IFeeOptions) => {
                            // this.onFeesChanged(feeOptions);
                        }}
                        // insufficientFundsFees={this.state.insufficientFundsFees}
                        insufficientFundsFees={false}
                        options={{
                            feeTotalBackgroundColor: theme.colors.inputBackground,
                            feeLabelLeftPadding: BASE_DIMENSION
                        }}
                    />
                </View>

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
                        account={account}
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
