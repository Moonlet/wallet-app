import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Button, Text } from '../../library';
import { closeTransactionRequest } from '../../redux/ui/transaction-request/actions';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { signAndSendTransaction } from '../../redux/wallets/actions';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import Icon from '../../components/icon';
import { normalize } from '../../styles/dimensions';
import { formatAddress } from '../../core/utils/format-address';
import { FeeTotal } from '../send/components/fee-total/fee-total';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { Amount } from '../../components/amount/amount';
import { getTokenConfig } from '../../redux/tokens/static-selectors';

export interface IReduxProps {
    isVisible: boolean;
    requestId: string;
    closeTransactionRequest: typeof closeTransactionRequest;
    signAndSendTransaction: typeof signAndSendTransaction;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.transactionRequest.isVisible,
        requestId: state.ui.transactionRequest.requestId
    };
};

const mapDispatchToProps = {
    closeTransactionRequest,
    signAndSendTransaction
};

export interface IState {
    transaction: any;
}

export class TransactionRequestScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            transaction: undefined
        };
    }

    public componentDidMount() {
        if (this.props.requestId) {
            this.getTransactionDetails();
        }
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.requestId !== prevProps.requestId && this.props.requestId !== null) {
            this.getTransactionDetails();
        }
    }

    private async getTransactionDetails() {
        try {
            const tx = await ConnectExtensionWeb.getRequestIdParams(this.props.requestId);
            if (tx) {
                this.setState({ transaction: tx });
            } else {
                this.setState({ transaction: undefined });
            }
        } catch {
            this.setState({ transaction: undefined });
        }
    }

    private async confirm() {
        try {
            const password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );

            this.props.signAndSendTransaction(
                this.state.transaction,
                password,
                this.props.requestId
            );
        } catch {
            //
        }
    }

    private renderMoonletTransferForm() {
        const { styles } = this.props;
        const { transaction } = this.state;

        if (transaction) {
            const blockchain = transaction.blockchain;

            const from = formatAddress(transaction.address, blockchain);
            const recipient = formatAddress(transaction.toAddress, blockchain);
            const tokenConfig = getTokenConfig(blockchain, transaction.token.symbol);

            return (
                <View style={{ flex: 1 }}>
                    {this.renderField(
                        translate('TransactionRequest.walletName'),
                        transaction.walletName
                    )}
                    {this.renderField(
                        translate('TransactionRequest.accountName'),
                        transaction.accountName
                    )}
                    {this.renderField(translate('App.labels.from'), from)}
                    {this.renderField(translate('App.labels.recipient'), recipient)}
                    <View style={styles.inputContainer}>
                        <Text style={styles.receipientLabel}>{translate('App.labels.amount')}</Text>
                        <View style={styles.inputBox}>
                            <Amount
                                style={styles.confirmTransactionText}
                                amount={transaction.amount}
                                token={transaction.token.symbol}
                                tokenDecimals={tokenConfig.decimals}
                                blockchain={blockchain}
                            />
                        </View>
                    </View>
                    <FeeTotal
                        amount={transaction.feeOptions.feeTotal}
                        blockchain={blockchain}
                        tokenSymbol={transaction.token.symbol}
                        backgroundColor={this.props.theme.colors.inputBackground}
                    />
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <LoadingIndicator />
                </View>
            );
        }
    }

    private renderField(label: string, value: string) {
        const { styles } = this.props;

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.receipientLabel}>{label}</Text>
                <View style={styles.inputBox}>
                    <Text style={styles.confirmTransactionText}>{value}</Text>
                </View>
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        if (this.props.isVisible) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>{translate('TransactionRequest.title')}</Text>

                    <View style={styles.content}>{this.renderMoonletTransferForm()}</View>

                    <Button
                        onPress={() => this.confirm()}
                        primary
                        disabled={this.state.transaction === undefined}
                    >
                        {translate('App.labels.confirm')}
                    </Button>

                    <TouchableOpacity
                        onPress={() => this.props.closeTransactionRequest()}
                        style={styles.closeButtonContainer}
                    >
                        <Icon name={'close'} size={normalize(20)} style={styles.closeButton} />
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }
    }
}

export const TransactionRequestScreen = smartConnect(TransactionRequestScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
