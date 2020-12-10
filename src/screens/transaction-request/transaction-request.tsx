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
import {
    sendTransferTransaction,
    sendTransaction,
    setSelectedWallet,
    signMessage
} from '../../redux/wallets/actions';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import Icon from '../../components/icon/icon';
import { normalize } from '../../styles/dimensions';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';
import { ResponsePayloadType } from '../../core/connect-extension/types';
import { ExtensionTransferRequest } from './extension-tx-request/extension-tx-request';
import {
    QRCodeTransferRequest,
    IQRCodeTxPayload,
    IQRCodeTransferData,
    QRCodeExtraParams
} from './qr-code-tx-request/qr-code-tx-request';
import { openURL } from '../../core/utils/linking-handler';
import CONFIG from '../../config';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { getUrlParams } from '../../core/connect-extension/utils';
import bind from 'bind-decorator';
import { IWalletState, IWalletsState } from '../../redux/wallets/state';
import { IconValues } from '../../components/icon/values';
import { getSelectedWallet } from '../../redux/wallets/selectors';
import { NotificationType } from '../../core/messaging/types';
import { IBlockchainTransaction, TransactionType } from '../../core/blockchain/types';

export interface IReduxProps {
    isVisible: boolean;
    requestId: string;
    qrCode: string;
    closeTransactionRequest: typeof closeTransactionRequest;
    sendTransferTransaction: typeof sendTransferTransaction;
    sendTransaction: typeof sendTransaction;
    signMessage: typeof signMessage;
    selectedWallet: IWalletState;
    setSelectedWallet: typeof setSelectedWallet;
    wallets: IWalletsState;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.transactionRequest.isVisible,
        requestId: state.ui.transactionRequest.data.requestId,
        qrCode: state.ui.transactionRequest.data.qrCode,
        selectedWallet: getSelectedWallet(state),
        wallets: state.wallets
    };
};

const mapDispatchToProps = {
    closeTransactionRequest,
    sendTransferTransaction,
    sendTransaction,
    signMessage,
    setSelectedWallet
};

export interface IState {
    extensionTxPayload: any;
    qrCodeTxPayload: IQRCodeTxPayload;
    error: {
        extensionError: boolean;
        generalError: boolean;
        tokenError: boolean;
        tokenErrorSymbol: string;
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
                tokenError: false,
                tokenErrorSymbol: undefined
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
            const payload = await ConnectExtensionWeb.getRequestIdData(this.props.requestId);
            if (payload) {
                const payloadParams = payload?.params[0] || {};
                const walletId = payloadParams.walletId || payloadParams.walletPubKey;

                if (
                    walletId !== this.props.selectedWallet.id &&
                    walletId !== this.props.selectedWallet.walletPublicKey
                ) {
                    const wallet = Object.values(this.props.wallets).find(
                        w => w.id === walletId || w.walletPublicKey === walletId
                    );

                    if (wallet) {
                        // Switch the wallet
                        this.props.setSelectedWallet(wallet.id);

                        this.setState({ extensionTxPayload: payload });
                    } else {
                        // The wallet has been removed from the app
                        // Maybe show a more relevant error message
                        this.setExtensionTxError();
                    }
                } else {
                    this.setState({ extensionTxPayload: payload });
                }
            } else {
                this.setExtensionTxError();
            }
        } catch {
            this.setExtensionTxError();
        }
    }

    private setExtensionTxError() {
        this.setState({
            extensionTxPayload: undefined,
            error: {
                extensionError: true,
                generalError: false,
                tokenError: false,
                tokenErrorSymbol: undefined
            }
        });
    }

    private async cancelTransactionRequest() {
        try {
            if (this.props.requestId) {
                await ConnectExtension.sendResponse(this.props.requestId, {
                    result: undefined,
                    errorCode: ResponsePayloadType.CANCEL
                });
            }
        } catch {
            //
        }
    }

    private async sendExtensionTx() {
        const { extensionTxPayload } = this.state;

        switch (extensionTxPayload.method as NotificationType) {
            case 'MOONLET_SIGN_MESSAGE':
                this.props.signMessage(
                    extensionTxPayload?.params[0]?.walletPubKey,
                    extensionTxPayload?.params[0]?.blockchain,
                    extensionTxPayload?.params[0]?.address,
                    extensionTxPayload?.params[0]?.message,
                    { requestId: this.props.requestId }
                );
                break;
            default:
                this.props.sendTransaction(extensionTxPayload?.params[0], {
                    goBack: false,
                    sendResponse: {
                        requestId: this.props.requestId
                    }
                });
        }
    }

    @bind
    private async confirm(options?: { qrCodeTransferData?: IQRCodeTransferData }) {
        try {
            const { extensionTxPayload } = this.state;

            if (extensionTxPayload) {
                this.sendExtensionTx();
            }

            if (options?.qrCodeTransferData) {
                this.props.sendTransferTransaction(
                    options.qrCodeTransferData.account,
                    options.qrCodeTransferData.toAddress,
                    options.qrCodeTransferData.amount,
                    options.qrCodeTransferData.token,
                    options.qrCodeTransferData.feeOptions,
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
                extensionError: false,
                generalError: true,
                tokenError: false,
                tokenErrorSymbol: undefined
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

                if (extraData[QRCodeExtraParams.Uint128Amount]) {
                    qrCodeTxPayload.params.amount = extraData[QRCodeExtraParams.Uint128Amount];
                }

                if (
                    extraData?.amount &&
                    extraData[QRCodeExtraParams.Uint128Amount] &&
                    extraData.amount !== extraData[QRCodeExtraParams.Uint128Amount]
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

                // To
                if (extraData.to) {
                    qrCodeTxPayload.params.toAddress = extraData.to;
                }

                // ByStr20-to
                if (extraData[QRCodeExtraParams.ByStr20TO]) {
                    qrCodeTxPayload.params.toAddress = extraData[QRCodeExtraParams.ByStr20TO];
                }

                if (
                    extraData.to &&
                    extraData[QRCodeExtraParams.ByStr20TO] &&
                    extraData.to !== extraData[QRCodeExtraParams.ByStr20TO]
                ) {
                    // Invalid URL
                    this.setInvalidQrCodeUrl();
                    return;
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
        const { extensionError, generalError, tokenError, tokenErrorSymbol } = this.state.error;

        if (extensionError || generalError || tokenError) {
            const errorMessage =
                extensionError === true
                    ? translate('TransactionRequest.errorMsgExtension')
                    : tokenError === true
                    ? translate('TransactionRequest.errorMsgToken', {
                          token:
                              tokenErrorSymbol !== undefined
                                  ? tokenErrorSymbol
                                  : translate('App.labels.theRequested')
                      })
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

                    {extensionError === true && (
                        <Button onPress={this.closeTxRequest}>
                            {translate('App.labels.cancel')}
                        </Button>
                    )}

                    {generalError === true && (
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
                    showError={(options: { tokenNotFound?: boolean; tokenSymbol?: string }) => {
                        if (options?.tokenNotFound) {
                            this.setState({
                                error: {
                                    extensionError: false,
                                    generalError: false,
                                    tokenError: true,
                                    tokenErrorSymbol: options?.tokenSymbol
                                }
                            });
                        } else {
                            this.setState({
                                error: {
                                    extensionError: false,
                                    generalError: true,
                                    tokenError: false,
                                    tokenErrorSymbol: undefined
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

    private getTitle() {
        let title = translate('TransactionRequest.title');
        if (this.state.extensionTxPayload) {
            switch (this.state.extensionTxPayload?.method) {
                case NotificationType.MOONLET_SIGN_MESSAGE:
                    title = translate('App.labels.signMessage');
                    break;
                case NotificationType.MOONLET_TRANSACTION:
                    const tx: IBlockchainTransaction = (this.state.extensionTxPayload?.params ||
                        [])[0];
                    switch (tx.type) {
                        case TransactionType.CONTRACT_CALL:
                            title = translate('App.labels.contractCall');
                            break;
                        case TransactionType.CONTRACT_DEPLOY:
                            title = translate('App.labels.contractDeploy');
                            break;
                    }
                    break;
            }
        }
        return title;
    }

    @bind
    private closeTxRequest() {
        this.props.closeTransactionRequest();

        if (this.state.extensionTxPayload) {
            this.cancelTransactionRequest();
        }

        this.setState({
            error: {
                extensionError: false,
                generalError: false,
                tokenError: false,
                tokenErrorSymbol: undefined
            },
            extensionTxPayload: undefined,
            qrCodeTxPayload: undefined
        });
    }

    public render() {
        const { styles } = this.props;
        const { extensionError, generalError, tokenError } = this.state.error;

        const showTestnetBadge =
            this.state.extensionTxPayload === undefined &&
            !extensionError &&
            !generalError &&
            !tokenError;

        if (this.props.isVisible) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>{this.getTitle()}</Text>

                    {showTestnetBadge && <TestnetBadge />}

                    <View style={styles.content}>{this.renderExtensionTx()}</View>

                    <TouchableOpacity
                        onPress={this.closeTxRequest}
                        style={styles.closeButtonContainer}
                    >
                        <Icon
                            name={IconValues.CLOSE}
                            size={normalize(20)}
                            style={styles.closeButton}
                        />
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
