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
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';
import { ResponsePayloadType } from '../../core/connect-extension/types';
import { ExtensionTransferRequest } from './extension-tx-request/extension-tx-request';
import {
    QRCodeTransferRequest,
    IQRCodeTxPayload,
    IQRCodeTransferData
} from './qr-code-tx-request/qr-code-tx-request';
import { openURL } from '../../core/utils/linking-handler';
import CONFIG from '../../config';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { getUrlParams } from '../../core/connect-extension/utils';
import bind from 'bind-decorator';

export interface IReduxProps {
    isVisible: boolean;
    requestId: string;
    qrCode: string;
    closeTransactionRequest: typeof closeTransactionRequest;
    sendTransferTransaction: typeof sendTransferTransaction;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.transactionRequest.isVisible,
        requestId: state.ui.transactionRequest.data.requestId,
        qrCode: state.ui.transactionRequest.data.qrCode
    };
};

const mapDispatchToProps = {
    closeTransactionRequest,
    sendTransferTransaction
};

export interface IState {
    extensionTxPayload: any;
    qrCodeTxPayload: IQRCodeTxPayload;
    error: {
        extensionError: boolean;
        generalError: boolean;
        tokenError: boolean;
    };
}

export class TransactionRequestScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            error: {
                extensionError: false,
                generalError: false,
                tokenError: false
            },
            extensionTxPayload: undefined,
            qrCodeTxPayload: undefined
        };
    }

    public componentDidMount() {
        if (this.props.requestId) {
            this.getExtensionTxPayload();
        }

        if (this.props.qrCode) {
            this.getQrCodeTxPayload();
        }
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.requestId !== prevProps.requestId && this.props.requestId !== undefined) {
            this.getExtensionTxPayload();
        }

        if (this.props.qrCode !== prevProps.qrCode && this.props.qrCode !== undefined) {
            this.getQrCodeTxPayload();
        }
    }

    private async getExtensionTxPayload() {
        try {
            const payload = await ConnectExtensionWeb.getRequestIdParams(this.props.requestId);

            if (payload) {
                this.setState({ extensionTxPayload: payload });
            } else {
                this.setState({
                    extensionTxPayload: undefined,
                    error: {
                        ...this.state.error,
                        extensionError: true
                    }
                });
            }
        } catch {
            this.setState({
                extensionTxPayload: undefined,
                error: {
                    ...this.state.error,
                    extensionError: true
                }
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

    @bind
    private async confirm(options?: { qrCodeTransferData?: IQRCodeTransferData }) {
        try {
            const password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );

            const { extensionTxPayload } = this.state;

            if (extensionTxPayload) {
                this.props.sendTransferTransaction(
                    extensionTxPayload.account,
                    extensionTxPayload.toAddress,
                    extensionTxPayload.amount,
                    extensionTxPayload.token,
                    extensionTxPayload.feeOptions,
                    password,
                    undefined, // navigation - not needed
                    extensionTxPayload.extraFields,
                    false, // goBack
                    { requestId: this.props.requestId }
                );
            }

            if (options?.qrCodeTransferData) {
                this.props.sendTransferTransaction(
                    options.qrCodeTransferData.account,
                    options.qrCodeTransferData.toAddress,
                    options.qrCodeTransferData.amount,
                    options.qrCodeTransferData.token,
                    options.qrCodeTransferData.feeOptions,
                    password,
                    undefined, // navigation - not needed
                    undefined, // extraFields - TODO
                    false // goBack
                );
            }
        } catch {
            //
        }
    }

    private setInvalidQrCodeUrl() {
        this.setState({
            error: {
                ...this.state.error,
                generalError: true
            }
        });
    }

    private getQrCodeTxPayload() {
        const code = this.props.qrCode;

        const regex = new RegExp(
            /^zilliqa:(\/\/)?([^/@?\n\ ]*)(@([^/?\n\ ]*))?([^?\n\ ]*)?(\?([^\n\ ]*)?)?$/
        );

        const qrCodeTxPayload: IQRCodeTxPayload = {
            address: undefined,
            chainId: undefined,
            fct: undefined,
            params: {
                amount: undefined,
                gasPrice: undefined,
                gasLimit: undefined
            }
        };

        const res = regex.exec(code);

        if (res) {
            // Address - bech32 address (ZIP-1 standard) | ZNS address
            const address = res[2];
            if (address && address !== '') {
                qrCodeTxPayload.address = address;
            } else {
                // Invalid QR code because to_address is required
                this.setInvalidQrCodeUrl();
                return;
            }

            // ChainId
            const chainId = res[4];
            if (chainId && chainId !== '') {
                // TODO: Number is used for Zilliqa
                // But if we need String, refactor this
                qrCodeTxPayload.chainId = Number(chainId);
            }

            // Function
            const fct = res[5];
            if (fct && fct !== '') {
                qrCodeTxPayload.fct = fct;
            }

            const extraData: any = getUrlParams(res[6]);

            if (extraData) {
                // Amount
                if (extraData?.amount) {
                    qrCodeTxPayload.params.amount = extraData.amount;
                }

                if (extraData['Uint128-amount']) {
                    qrCodeTxPayload.params.amountUint128 = extraData['Uint128-amount'];
                }

                if (
                    extraData?.amount &&
                    extraData['Uint128-amount'] &&
                    extraData.amount !== extraData['Uint128-amount']
                ) {
                    // Invalid URL
                    this.setInvalidQrCodeUrl();
                    return;
                }

                // Gas Price
                if (extraData?.gasPrice) {
                    qrCodeTxPayload.params.gasPrice = extraData.gasPrice;
                }

                // Gas Limit
                if (extraData?.gasLimit) {
                    qrCodeTxPayload.params.gasLimit = extraData.gasLimit;
                }

                // ByStr20-to
                if (extraData['ByStr20-to']) {
                    qrCodeTxPayload.params.ByStr20To = extraData['ByStr20-to'];
                }
            }

            this.setState({ qrCodeTxPayload });
        } else {
            // Invalid QR Code URL
            this.setInvalidQrCodeUrl();
        }
    }

    private renderExtensionTx() {
        const { extensionTxPayload, qrCodeTxPayload } = this.state;
        const { styles } = this.props;
        const { extensionError, generalError, tokenError } = this.state.error;

        if (extensionError || generalError || tokenError) {
            const errorMessage = extensionError
                ? translate('TransactionRequest.errorMsgExtension')
                : tokenError
                ? translate('TransactionRequest.errorMsgToken')
                : translate('TransactionRequest.errorMsgGeneral');

            return (
                <View style={styles.errorWrapper}>
                    <View style={styles.errorContainer}>
                        <Image
                            style={styles.logoImage}
                            source={require('../../assets/images/png/moonlet_space_gray.png')}
                        />
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    </View>

                    {extensionError && (
                        <Button onPress={() => this.cancelTransactionRequest()}>
                            {translate('App.labels.cancel')}
                        </Button>
                    )}

                    {generalError && (
                        <Button onPress={() => openURL(CONFIG.supportUrl)}>
                            {translate('App.labels.createTicket')}
                        </Button>
                    )}
                </View>
            );
        } else if (extensionTxPayload) {
            return (
                <ExtensionTransferRequest
                    extensionTxPayload={extensionTxPayload}
                    callback={this.confirm}
                />
            );
        } else if (qrCodeTxPayload) {
            return (
                <QRCodeTransferRequest
                    qrCodeTxPayload={qrCodeTxPayload}
                    callback={this.confirm}
                    showError={(options: { tokenNotFound?: boolean }) => {
                        if (options?.tokenNotFound) {
                            this.setState({
                                error: {
                                    ...this.state.error,
                                    tokenError: true
                                }
                            });
                        } else {
                            this.setState({
                                error: {
                                    ...this.state.error,
                                    generalError: true
                                }
                            });
                        }
                    }}
                />
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <LoadingIndicator />
                </View>
            );
        }
    }

    public render() {
        const { styles } = this.props;
        const { extensionError, generalError, tokenError } = this.state.error;

        const showTestnetBadge =
            this.state.qrCodeTxPayload?.chainId !== undefined &&
            !extensionError &&
            !generalError &&
            !tokenError;

        if (this.props.isVisible) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>{translate('TransactionRequest.title')}</Text>

                    {showTestnetBadge && <TestnetBadge />}

                    <View style={styles.content}>{this.renderExtensionTx()}</View>

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
