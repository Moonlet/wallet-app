import React from 'react';
import { View, Image } from 'react-native';
import { Button, Text } from '../../../library';
import { IExtensionRequest } from '../../../core/communication/extension';
import { translate } from '../../../core/i18n';
import { ConnectExtension } from '../../../core/connect-extension/connect-extension';
import bind from 'bind-decorator';
import { smartConnect } from '../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';
import { ConnectExtensionWeb } from '../../../core/connect-extension/connect-extension-web';
import { NotificationType } from '../../../core/messaging/types';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';
import { connect } from 'react-redux';
import { IReduxState } from '../../../redux/state';
import { getChainId } from '../../../redux/preferences/selectors';
import { IWalletsState } from '../../../redux/wallets/state';
import { toBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { isBech32 } from '@zilliqa-js/util/dist/validation';

interface IExternalProps {
    requestId: string;
    request: IExtensionRequest;
    onResponse: (response) => any;
}

interface IReduxProps {
    chainId: ChainIdType;
    wallets: IWalletsState;
}

const mapStateToProps = (state: IReduxState) => {
    const blockchain = Blockchain.ZILLIQA;

    return {
        wallets: state.wallets,
        chainId: getChainId(state, blockchain)
    };
};
export class NativeForwardComp extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    private async getRequestPayload() {
        const rpcRequest = this.props.request.params[0];

        let sendRequestPayload;

        if (rpcRequest?.method && rpcRequest?.params) {
            switch (rpcRequest.method) {
                case 'CreateTransaction':
                    const rpcParams = this.props.request?.params[0]?.params[0] || {};
                    let method = NotificationType.MOONLET_TRANSFER;

                    if (rpcParams.data) {
                        // todo check if toAddr needs to be verified
                        if (rpcParams.code) {
                            method = NotificationType.MOONLET_CONTRACT_DEPLOY;
                        } else {
                            // let data: any = {};
                            // try {
                            //     data = JSON.parse(rpcParams.data);
                            // } catch {
                            //     //
                            // }
                            // if (
                            //     data._tag === 'Transfer' &&
                            //     data.params[0]?.vname === 'to' &&
                            //     data.params[0]?.type === 'ByStr20' &&
                            //     data.params[1]?.vname === 'amount' &&
                            //     data.params[1]?.type === 'Uint128'
                            // ) {
                            //     const client = getBlockchain(Blockchain.ZILLIQA).getClient(
                            //         this.props.chainId
                            //     );
                            //     const token = await client.tokens[TokenType.ZRC2].getTokenInfo(
                            //         rpcParams.toAddr
                            //     );
                            //     sendRequestPayload = {
                            //         method,
                            //         params: [
                            //             {
                            //                 account: Object.values(this.props.wallets)
                            //                     .find(
                            //                         w =>
                            //                             w.walletPublicKey ===
                            //                             this.props.request?.walletPubKey
                            //                     )
                            //                     ?.accounts?.find(
                            //                         acc => acc.address === rpcParams.fromAddr
                            //                     ),
                            //                 toAddress: isBech32(rpcParams.toAddr)
                            //                     ? rpcParams.toAddr
                            //                     : toBech32Address(rpcParams.toAddr),
                            //                 amount: data.params[1]?.value,
                            //                 token: token.symbol,
                            //                 feeOptions: {
                            //                     gasPrice: rpcParams.gasPrice,
                            //                     gasLimit: rpcParams.gasLimit
                            //                 },
                            //                 walletPubKey: this.props.request?.walletPubKey
                            //             }
                            //         ],
                            //         notification: {
                            //             title: translate(
                            //                 'Notifications.extensionSignMessage.title'
                            //             ),
                            //             body: translate('Notifications.extensionSignMessage.body')
                            //         }
                            //     };
                            // } else {
                            //     // not a ZRC2 call
                            //     method = NotificationType.MOONLET_CONTRACT_CALL;
                            // }
                        }
                    } else {
                        sendRequestPayload = {
                            method,
                            params: [
                                {
                                    account: Object.values(this.props.wallets)
                                        .find(
                                            w =>
                                                w.walletPublicKey ===
                                                this.props.request?.walletPubKey
                                        )
                                        ?.accounts?.find(
                                            acc =>
                                                acc.address === rpcParams.fromAddr &&
                                                acc.blockchain === Blockchain.ZILLIQA
                                        ),
                                    toAddress: isBech32(rpcParams.toAddr)
                                        ? rpcParams.toAddr
                                        : toBech32Address(rpcParams.toAddr),
                                    amount: rpcParams.amount,
                                    token: 'ZIL',
                                    feeOptions: {
                                        gasPrice: rpcParams.gasPrice,
                                        gasLimit: rpcParams.gasLimit
                                    },
                                    walletPubKey: this.props.request?.walletPubKey
                                }
                            ],
                            notification: {
                                title: translate('Notifications.extensionSignMessage.title'),
                                body: translate('Notifications.extensionSignMessage.body')
                            }
                        };
                    }
                    break;
                case 'SignMessage':
                    sendRequestPayload = {
                        method: NotificationType.MOONLET_SIGN_MESSAGE,
                        params: [
                            {
                                walletPubKey: this.props.request.walletPubKey,
                                blockchain: this.props.request.blockchain,
                                accountAddress: rpcRequest.params[0],
                                message: rpcRequest.params[1]
                            }
                        ],
                        notification: {
                            title: translate('Notifications.extensionSignMessage.title'),
                            body: translate('Notifications.extensionSignMessage.body')
                        }
                    };
                    break;
            }
        } else {
            throw new Error('Invalid request');
        }

        return sendRequestPayload;
    }

    public async componentDidMount() {
        /**
         * TODO:
         * - check transaction type:
         *      - Transfer native token / zrc 2
         *      - Contract call
         *      - Sign Message
         */

        // console.log('method: ', this.props.request.params[0].method);
        // console.log('requestId: ', this.props.requestId);

        try {
            const sendRequestRes = await ConnectExtension.sendRequest(
                await this.getRequestPayload()
            );
            // console.log('sendRequestRes: ', sendRequestRes);

            if (sendRequestRes?.success) {
                ConnectExtensionWeb.listenerReqResponse(
                    sendRequestRes.data.requestId,
                    async (res: { result: any; errorCode: string }) => {
                        if (res.errorCode) {
                            this.props.onResponse({
                                jsonrpc: '2.0',
                                error: {
                                    code: -1,
                                    message: 'GENERIC_ERROR: ' + res.errorCode
                                }
                            });

                            window.close();
                        } else {
                            let result = { result: res.result };
                            if (res?.result?.rawResponse) {
                                result = res.result.rawResponse;
                            }

                            this.props.onResponse({
                                jsonrpc: '2.0',
                                ...result
                            });
                            window.close();
                        }
                    }
                );
            }
        } catch (err) {
            // console.log('error: ', err);
        }
    }

    @bind
    private onCancel() {
        this.props.onResponse({
            jsonrpc: '2.0',
            error: {
                code: -1,
                message: 'CANCELED_BY_USER: Operation cancelled by user'
            }
        });

        window.close();
    }

    // @bind
    // private onSign(result: any) {
    //     this.props.onResponse({
    //         jsonrpc: '2.0',
    //         result
    //     });
    // }

    public render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.loadingHeaderContainer}>
                    <Image
                        source={require('../../../assets/images/png/moonlet_logo.png')}
                        style={styles.moonletLogo}
                    />
                    <Text style={styles.headerTitle}>{`Moonlet`}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <View>
                        <LoadingIndicator />
                    </View>
                    <Text style={styles.loadingText}>
                        {translate('ExtensionBackgroundRequest.waiting')}
                    </Text>
                </View>
                <Button onPress={this.onCancel}>{translate('App.labels.cancel')}</Button>
            </View>
        );
    }
}

export const NativeForwardComponent = smartConnect<IExternalProps>(NativeForwardComp, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
