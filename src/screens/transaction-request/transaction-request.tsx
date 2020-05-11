import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Button, Text } from '../../library';
import { closeTransactionRequest } from '../../redux/ui/transaction-request/actions';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { sendTransferTransaction } from '../../redux/wallets/actions';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import Icon from '../../components/icon';
import { normalize } from '../../styles/dimensions';
import { formatAddress } from '../../core/utils/format-address';
import { FeeTotal } from '../send/components/fee-total/fee-total';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { formatNumber } from '../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';
import { ResponsePayloadType } from '../../core/connect-extension/types';

export interface IReduxProps {
    isVisible: boolean;
    requestId: string;
    closeTransactionRequest: typeof closeTransactionRequest;
    sendTransferTransaction: typeof sendTransferTransaction;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.transactionRequest.isVisible,
        requestId: state.ui.transactionRequest.requestId
    };
};

const mapDispatchToProps = {
    closeTransactionRequest,
    sendTransferTransaction
};

export interface IState {
    moonletTransferPayload: any;
    tryAgain: boolean;
}

export class TransactionRequestScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            moonletTransferPayload: undefined,
            tryAgain: false
        };
    }

    public componentDidMount() {
        if (this.props.requestId) {
            this.getTransferPayload();
        }
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.requestId !== prevProps.requestId && this.props.requestId !== null) {
            this.getTransferPayload();
        }
    }

    private async getTransferPayload() {
        try {
            // Reset Try again and start loading
            this.setState({
                moonletTransferPayload: undefined,
                tryAgain: false
            });

            const payload = await ConnectExtensionWeb.getRequestIdParams(this.props.requestId);
            if (payload) {
                this.setState({ moonletTransferPayload: payload });
            } else {
                this.setState({
                    moonletTransferPayload: undefined,
                    tryAgain: true
                });
            }
        } catch {
            this.setState({
                moonletTransferPayload: undefined,
                tryAgain: true
            });
        }
    }

    private async cancelTransactionRequest() {
        try {
            this.props.closeTransactionRequest();

            if (this.props.requestId) {
                await ConnectExtension.sendResponse(this.props.requestId, {
                    result: undefined,
                    errorCode: ResponsePayloadType.CANCEL
                });
            }
        } catch {
            this.props.closeTransactionRequest();
        }
    }

    private async confirm() {
        try {
            const password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );

            const { moonletTransferPayload } = this.state;

            this.props.sendTransferTransaction(
                moonletTransferPayload.account,
                moonletTransferPayload.toAddress,
                moonletTransferPayload.amount,
                moonletTransferPayload.token,
                moonletTransferPayload.feeOptions,
                password,
                undefined, // navigation - not needed
                moonletTransferPayload.extraFields,
                false, // goBack
                { requestId: this.props.requestId }
            );
        } catch {
            //
        }
    }

    private renderMoonletTransferForm() {
        const { moonletTransferPayload } = this.state;
        const { styles } = this.props;

        if (moonletTransferPayload) {
            const account = moonletTransferPayload.account;
            const blockchain = account.blockchain;

            const from = formatAddress(account.address, blockchain);
            const recipient = formatAddress(moonletTransferPayload.toAddress, blockchain);

            const formattedAmount = formatNumber(new BigNumber(moonletTransferPayload.amount), {
                currency: getBlockchain(blockchain).config.coin
            });

            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {this.renderField(
                            translate('TransactionRequest.walletName'),
                            moonletTransferPayload.walletName
                        )}
                        {this.renderField(
                            translate('TransactionRequest.accountName'),
                            account?.name || `Account ${account.index + 1}`
                        )}
                        {this.renderField(translate('App.labels.from'), from)}
                        {this.renderField(translate('App.labels.recipient'), recipient)}
                        {this.renderField(translate('App.labels.amount'), formattedAmount)}
                        <FeeTotal
                            amount={moonletTransferPayload.feeOptions.feeTotal}
                            blockchain={blockchain}
                            tokenSymbol={moonletTransferPayload.token}
                            backgroundColor={this.props.theme.colors.inputBackground}
                        />
                    </View>

                    <Button
                        onPress={() => this.confirm()}
                        primary
                        disabled={this.state.moonletTransferPayload === undefined}
                    >
                        {translate('App.labels.confirm')}
                    </Button>
                </View>
            );
        } else if (this.state.tryAgain) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.errorContainer}>
                        <Image
                            style={styles.logoImage}
                            source={require('../../assets/images/png/moonlet_space_gray.png')}
                        />
                        <Text style={styles.errorMessage}>
                            {translate('TransactionRequest.errorMessage')}
                        </Text>
                    </View>

                    <Button onPress={() => this.getTransferPayload()} primary>
                        {translate('App.labels.tryAgain')}
                    </Button>
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

                    <TouchableOpacity
                        onPress={() => this.cancelTransactionRequest()}
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
