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
import { QRCodeTransferRequest } from './qr-code-tx-request/qr-code-tx-request';
import { openURL } from '../../core/utils/linking-handler';
import CONFIG from '../../config';

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
    extensionTxPayload: any;
    qrCodeTxPayload: any;
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
            // qrCodeTxPayload: {
            //     account: {
            //         index: 0,
            //         selected: true,
            //         blockchain: 'ZILLIQA',
            //         address: 'zil14dsu2756fvn59f9ryhkdnemmtkn87e3672pfkr',
            //         publicKey: '0364108fe09586a87a446a5be6c38824db88d58d5aa487de02d37ab47a7b61e681',
            //         tokens: {
            //             '1': {
            //                 ZIL: {
            //                     symbol: 'ZIL',
            //                     order: 0,
            //                     active: true,
            //                     balance: { value: '0', inProgress: false }
            //                 }
            //             },
            //             '333': {
            //                 ZIL: {
            //                     symbol: 'ZIL',
            //                     order: 0,
            //                     active: true,
            //                     balance: {
            //                         value: '631904500000000',
            //                         inProgress: false,
            //                         timestamp: '2020-05-18T15:06:52.680Z'
            //                     }
            //                 },
            //                 XSGD: {
            //                     symbol: 'XSGD',
            //                     order: 1,
            //                     active: true,
            //                     balance: {
            //                         value: '0',
            //                         inProgress: false,
            //                         error: {
            //                             error: {
            //                                 code: -5,
            //                                 data: null,
            //                                 message: 'Address not contract address'
            //                             },
            //                             id: 41,
            //                             jsonrpc: '2.0'
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     },
            //     toAddress: 'zil14dsu2756fvn59f9ryhkdnemmtkn87e3672pfkr',
            //     amount: '0.1',
            //     token: 'ZIL',
            //     feeOptions: { gasPrice: '1000000000', gasLimit: '1', feeTotal: '1000000000' },
            //     extraFields: { memo: '' },
            //     walletName: 'Wallet 1'
            // }
        };
    }

    public componentDidMount() {
        if (this.props.requestId) {
            this.getExtensionTxPayload();
        }
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
