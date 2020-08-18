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

interface IExternalProps {
    requestId: string;
    request: IExtensionRequest;
    onResponse: (response) => any;
}

export class NativeForwardComp extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public async componentDidMount() {
        // console.log('method: ', this.props.request.params[0].method);
        // console.log('requestId: ', this.props.requestId);

        // TODO: refactor notification messages
        const sendRequestPayload = {
            method: this.props.request.params[0].method,
            params: [this.props.requestId],
            notification: {
                title: translate('Notifications.extensionTx.title'),
                body: translate('Notifications.extensionTx.body', {
                    formattedAmount: '1 ZIL',
                    formattedAddress: 'novi'
                })
            }
        };

        try {
            const sendRequestRes = await ConnectExtension.sendRequest(sendRequestPayload);
            // console.log('sendRequestRes: ', sendRequestRes);

            if (sendRequestRes?.success) {
                ConnectExtensionWeb.listenerReqResponse(
                    sendRequestRes.data.requestId,
                    async (res: { result: any; errorCode: string }) => {
                        if (res.errorCode) {
                            // console.log('errorCode: ', res.errorCode);
                        } else {
                            // console.log('res: ', res);
                        }

                        // this.onSign(res)
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
    withTheme(stylesProvider)
]);
