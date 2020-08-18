import React from 'react';
import { View, Image } from 'react-native';
import stylesProvider from './styles';
import { bgPortRequest } from '../../core/communication/bg-port';
import { IExtensionResponse, IExtensionRequest } from '../../core/communication/extension';
import { AccountConnectComponent } from './account-connect/account-connect';
import bind from 'bind-decorator';
import { NativeForwardComponent } from './native-forward/native-forward';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { Text, Button } from '../../library';

interface IState {
    requestId: string;
    request: IExtensionRequest;
}

export class ExtensionBackgroundRequestComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        const requestId = document.location.hash.substring(1);

        this.state = {
            requestId,
            request: undefined
        };

        // call bg script to get screen data
        bgPortRequest({
            origin: document.location.href,
            controller: 'ScreenController',
            method: 'getRequest',
            params: [requestId]
        })
            .then((response: IExtensionResponse) => {
                this.setState({
                    request: response.data
                });
            })
            .catch(error => {
                // TODO: set error in state and dispplay an error message...
            });
    }

    @bind
    private onResponse(response) {
        bgPortRequest({
            origin: document.location.href,
            controller: 'ScreenController',
            method: 'setResponse',
            params: [this.state.requestId, { data: response }]
        });
        window.close();
    }

    private renderDefaultScreen() {
        const { styles } = this.props;

        return (
            <View style={styles.defaultSreenContainer}>
                <View style={styles.loadingHeaderContainer}>
                    <Image
                        source={require('../../assets/images/png/moonlet_logo.png')}
                        style={styles.moonletLogo}
                    />
                    <Text style={styles.headerTitle}>{`Moonlet`}</Text>
                </View>
                <View style={this.props.styles.unknownOpContainer}>
                    <Text style={this.props.styles.unknownOpText}>
                        {translate('App.labels.unknownOp')}
                    </Text>
                </View>
                <Button onPress={() => window.close()}>{translate('App.labels.cancel')}</Button>
            </View>
        );
    }

    private renderScreen() {
        switch (this.state?.request?.params[0]?.method) {
            case 'GetAccounts':
                return <AccountConnectComponent onResponse={this.onResponse} />;
            case 'SignMessage':
            case 'CreateTransaction':
                return (
                    <NativeForwardComponent
                        requestId={this.state.requestId}
                        request={this.state.request}
                        onResponse={this.onResponse}
                    />
                );
            default:
                return this.renderDefaultScreen();
        }
    }

    public render() {
        return <View style={this.props.styles.container}>{this.renderScreen()}</View>;
    }
}

export const ExtensionBackgroundRequest = smartConnect(ExtensionBackgroundRequestComponent, [
    withTheme(stylesProvider)
]);
