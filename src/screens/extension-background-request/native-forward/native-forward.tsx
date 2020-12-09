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
import {
    Blockchain,
    ChainIdType,
    TransactionType,
    IBlockchainTransaction
} from '../../../core/blockchain/types';
import { connect } from 'react-redux';
import { IReduxState } from '../../../redux/state';
import { getChainId } from '../../../redux/preferences/selectors';
import { IWalletsState } from '../../../redux/wallets/state';
import { toBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { BigNumber } from 'bignumber.js';
import { TransactionStatus } from '../../../core/wallet/types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { formatNumber } from '../../../core/utils/format-number';
import { formatAddress } from '../../../core/utils/format-address';

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
        const blockchainInstance = getBlockchain(Blockchain.ZILLIQA);

        let sendRequestPayload;

        if (rpcRequest?.method && rpcRequest?.params) {
            switch (rpcRequest.method) {
                case 'CreateTransaction':
                    const rpcParams = this.props.request?.params[0]?.params[0] || {};
                    const method = NotificationType.MOONLET_TRANSACTION;
                    const account = Object.values(this.props.wallets)
                        .find(w => w.walletPublicKey === this.props.request?.walletPubKey)
                        ?.accounts?.find(
                            acc =>
                                acc.address === rpcParams.fromAddr &&
                                acc.blockchain === Blockchain.ZILLIQA
                        );

                    if (rpcParams.data) {
                        // todo check if toAddr needs to be verified
                        if (rpcParams.code) {
                            // contract deploy
                            const transaction: IBlockchainTransaction = {
                                walletPubKey: this.props.request?.walletPubKey,
                                date: {
                                    created: Date.now(),
                                    signed: undefined,
                                    broadcasted: undefined,
                                    confirmed: undefined
                                },
                                blockchain: account.blockchain,
                                chainId: this.props.request?.chainId,
                                type: TransactionType.CONTRACT_DEPLOY,

                                address: account.address,
                                publicKey: account.publicKey,

                                toAddress: isBech32(rpcParams.toAddr)
                                    ? rpcParams.toAddr
                                    : toBech32Address(rpcParams.toAddr),
                                amount: blockchainInstance.account
                                    .amountFromStd(new BigNumber(rpcParams.amount), 12)
                                    .toFixed(),
                                feeOptions: {
                                    gasPrice: rpcParams.gasPrice,
                                    gasLimit: rpcParams.gasLimit
                                },

                                code: rpcParams.code,
                                data: {
                                    raw: rpcParams.data
                                },

                                broadcastedOnBlock: undefined,
                                nonce: undefined,
                                status: TransactionStatus.PENDING
                            };
                            sendRequestPayload = {
                                method,
                                params: [transaction],
                                notification: {
                                    title: translate('Notifications.extensionContractDeploy.title'),
                                    body: translate('Notifications.extensionContractDeploy.body')
                                }
                            };
                        } else {
                            const transaction: IBlockchainTransaction = {
                                walletPubKey: this.props.request?.walletPubKey,
                                date: {
                                    created: Date.now(),
                                    signed: undefined,
                                    broadcasted: undefined,
                                    confirmed: undefined
                                },
                                blockchain: account.blockchain,
                                chainId: this.props.request?.chainId,
                                type: TransactionType.CONTRACT_CALL,

                                address: account.address,
                                publicKey: account.publicKey,

                                toAddress: isBech32(rpcParams.toAddr)
                                    ? rpcParams.toAddr
                                    : toBech32Address(rpcParams.toAddr),
                                amount: blockchainInstance.account
                                    .amountFromStd(
                                        new BigNumber(rpcParams.amount),
                                        getTokenConfig(
                                            account.blockchain,
                                            blockchainInstance.config.coin
                                        ).decimals
                                    )
                                    .toFixed(),
                                feeOptions: {
                                    gasPrice: rpcParams.gasPrice,
                                    gasLimit: rpcParams.gasLimit
                                },

                                data: {
                                    method: rpcParams.data?._tag,
                                    params: (rpcParams.data?.params || []).map(p => p?.value || p),
                                    raw: rpcParams.data
                                },

                                broadcastedOnBlock: undefined,
                                nonce: undefined,
                                status: TransactionStatus.PENDING
                            };
                            sendRequestPayload = {
                                method,
                                params: [transaction],
                                notification: {
                                    title: translate('Notifications.extensionContractCall.title'),
                                    body: translate('Notifications.extensionContractCall.body')
                                }
                            };
                        }
                    } else {
                        const amount = blockchainInstance.account
                            .amountFromStd(new BigNumber(rpcParams.amount), 12)
                            .toFixed();
                        const transaction: IBlockchainTransaction = {
                            walletPubKey: this.props.request?.walletPubKey,
                            date: {
                                created: Date.now(),
                                signed: undefined,
                                broadcasted: undefined,
                                confirmed: undefined
                            },
                            blockchain: account.blockchain,
                            chainId: this.props.request?.chainId,
                            type: TransactionType.TRANSFER,
                            token: getTokenConfig(
                                account.blockchain,
                                getBlockchain(account.blockchain).config.coin
                            ),

                            address: account.address,
                            publicKey: account.publicKey,

                            toAddress: isBech32(rpcParams.toAddr)
                                ? rpcParams.toAddr
                                : toBech32Address(rpcParams.toAddr),
                            amount,
                            feeOptions: {
                                gasPrice: rpcParams.gasPrice,
                                gasLimit: rpcParams.gasLimit
                            },
                            broadcastedOnBlock: undefined,
                            nonce: undefined,
                            status: TransactionStatus.PENDING
                        };
                        const formattedAmount = formatNumber(new BigNumber(amount), {
                            currency: getBlockchain(account.blockchain).config.coin
                        });

                        const formattedAddress = formatAddress(account.address, account.blockchain);

                        sendRequestPayload = {
                            method,
                            params: [transaction],
                            notification: {
                                title: translate('Notifications.extensionTx.title'),
                                body: translate('Notifications.extensionTx.body', {
                                    formattedAmount,
                                    formattedAddress
                                })
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
                                address: rpcRequest.params[0],
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
