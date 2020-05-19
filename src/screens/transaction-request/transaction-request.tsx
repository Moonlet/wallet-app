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
import { QRCodeTransferRequest, IQRCodeTxPayload } from './qr-code-tx-request/qr-code-tx-request';
import { openURL } from '../../core/utils/linking-handler';
import CONFIG from '../../config';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { getUrlParams } from '../../core/connect-extension/utils';
import { getSelectedBlockchain } from '../../redux/wallets/selectors';
import { Blockchain } from '../../core/blockchain/types';

export interface IReduxProps {
    isVisible: boolean;
    requestId: string;
    closeTransactionRequest: typeof closeTransactionRequest;
    sendTransferTransaction: typeof sendTransferTransaction;
    blockchain: Blockchain;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.transactionRequest.isVisible,
        requestId: state.ui.transactionRequest.requestId,
        blockchain: getSelectedBlockchain(state)
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
        tokenError: string;
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
                generalError: true,
                tokenError: undefined
            },
            extensionTxPayload: undefined,
            qrCodeTxPayload: undefined
        };
    }

    public componentDidMount() {
        if (this.props.requestId) {
            this.getExtensionTxPayload();
        }

        const qrCode =
            'zilliqa:zil102n74869xnvdwq3yh8p0k9jjgtejruft268tg8@333/?amount=1000000000000';
        this.getQrCodeTxPayload(qrCode);
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.requestId !== prevProps.requestId && this.props.requestId !== null) {
            this.getExtensionTxPayload();
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

    private async confirm() {
        try {
            const password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );

            const { extensionTxPayload } = this.state;

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
        } catch {
            //
        }
    }

    private getQrCodeTxPayload(code: string) {
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
        // console.log('res: ', res);

        if (res) {
            const address = res[2];
            // console.log('address: ', address);
            if (address && address !== '') {
                qrCodeTxPayload.address = address;
            }

            const chainId = res[4];
            // console.log('chainId: ', chainId);
            if (chainId && chainId !== '') {
                qrCodeTxPayload.chainId =
                    this.props.blockchain === Blockchain.ZILLIQA ? Number(chainId) : chainId;
            }

            const fct = res[5];
            // console.log('fct: ', fct);
            if (fct && fct !== '') {
                qrCodeTxPayload.fct = fct;
            }

            const extraData: any = getUrlParams(res[6]);
            // console.log('extraData: ', extraData);

            if (extraData) {
                const amount = extraData?.amount;
                // console.log('amount: ', amount);

                if (amount) {
                    qrCodeTxPayload.params.amount = amount;
                }
            }

            // console.log('qrCodeTxPayload: ', qrCodeTxPayload);
            this.setState({ qrCodeTxPayload });
        }
    }

    private renderExtensionTx() {
        const { extensionTxPayload, qrCodeTxPayload } = this.state;
        const { styles } = this.props;
        const { extensionError, generalError, tokenError } = this.state.error;

        if (extensionTxPayload) {
            return (
                <ExtensionTransferRequest
                    extensionTxPayload={extensionTxPayload}
                    callback={() => this.confirm()}
                />
            );
        } else if (qrCodeTxPayload) {
            return (
                <QRCodeTransferRequest
                    qrCodeTxPayload={qrCodeTxPayload}
                    callback={() => this.confirm()}
                    errorToken={(tokenSymbol: string) =>
                        this.setState({ error: { ...this.state.error, tokenError: tokenSymbol } })
                    }
                />
            );
        } else if (extensionError || generalError || tokenError) {
            const errorMessage = extensionError
                ? translate('TransactionRequest.errorMsgExtension')
                : tokenError
                ? translate('TransactionRequest.errorMsgToken', { token: tokenError })
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

        if (this.props.isVisible) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>{translate('TransactionRequest.title')}</Text>

                    <TestnetBadge isVisible={this.state.qrCodeTxPayload?.chainId !== undefined} />

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
