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
import { IWalletState, IAccountState } from '../../../redux/wallets/state';
import { IReduxState } from '../../../redux/state';
import { getSelectedWallet, getSelectedAccount } from '../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { Amount } from '../../../components/amount/amount';
import { calculateBalance } from '../../../core/utils/balance';
import { ChainIdType, IFeeOptions } from '../../../core/blockchain/types';
import { IExchangeRates } from '../../../redux/market/state';
import { getChainId } from '../../../redux/preferences/selectors';
import { FeeOptions } from '../../send/components/fee-options/fee-options';
import { BASE_DIMENSION } from '../../../styles/dimensions';

export interface IExternalProps {
    gitcoinTransferPayload: any;
    callback: () => void;
}

export interface IReduxProps {
    wallet: IWalletState;
    selectedAccount: IAccountState;
    chainId: ChainIdType;
    exchangeRates: IExchangeRates;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        wallet: getSelectedWallet(state),
        selectedAccount,
        chainId: getChainId(state, selectedAccount.blockchain),
        exchangeRates: state.market.exchangeRates
    };
};

interface IState {
    amount: string;
    chainId: ChainIdType;
}

export class GitcoinTransferTxRequestComponent extends React.Component<
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
        if (this.props.gitcoinTransferPayload) {
            const formattedAmount = formatNumber(
                new BigNumber(this.props.gitcoinTransferPayload.amount),
                {
                    currency: getBlockchain(this.props.selectedAccount.blockchain).config.coin
                }
            );

            this.setState({ amount: formattedAmount });
        }
    }

    private renderField(
        label: string,
        value: string,
        options?: { isAmount?: boolean; inputColor?: string }
    ) {
        const { styles, gitcoinTransferPayload, theme } = this.props;

        let allBalance;
        let tokenConfig;
        let blockchain;

        if (options?.isAmount) {
            blockchain = this.props.selectedAccount.blockchain;

            tokenConfig = getTokenConfig(blockchain, gitcoinTransferPayload.token);

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

    public render() {
        const { gitcoinTransferPayload, styles, theme, selectedAccount } = this.props;

        const account = gitcoinTransferPayload.account;
        const blockchain = account.blockchain;

        const from = formatAddress(account.address, blockchain);
        const recipient = formatAddress(gitcoinTransferPayload.toAddress, blockchain);

        const tokenConfig = getTokenConfig(blockchain, gitcoinTransferPayload.token);
        const config = getBlockchain(this.props.selectedAccount.blockchain).config;

        const stdAmount = getBlockchain(blockchain).account.amountToStd(
            new BigNumber(gitcoinTransferPayload.amount),
            tokenConfig.decimals
        );

        const token = this.props.selectedAccount.tokens[this.props.chainId][config.coin];
        // TODO: sendingToken

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    {this.renderField(
                        translate('TransactionRequest.walletName'),
                        this.props.wallet.name,
                        { inputColor: theme.colors.text }
                    )}

                    {this.renderField(
                        translate('TransactionRequest.accountName'),
                        selectedAccount.name || `Account ${selectedAccount.index + 1}`,
                        { inputColor: theme.colors.text }
                    )}

                    {this.renderField(translate('App.labels.balance'), undefined, {
                        isAmount: true
                    })}

                    {this.renderField(translate('App.labels.from'), from)}
                    {this.renderField(translate('App.labels.recipient'), recipient)}

                    {this.renderInputField(translate('App.labels.amount'), this.state.amount)}

                    <FeeOptions
                        token={token}
                        sendingToken={token} // TODO
                        account={this.props.selectedAccount}
                        toAddress={gitcoinTransferPayload.toAddress}
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
                    disabled={gitcoinTransferPayload === undefined}
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

export const GitcoinTransferTxRequest = smartConnect<IExternalProps>(
    GitcoinTransferTxRequestComponent,
    [connect(mapStateToProps, null), withTheme(stylesProvider)]
);
