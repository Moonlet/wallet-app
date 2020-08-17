import React from 'react';
import { View, Text, Image } from 'react-native';
import stylesProvider from './styles';
import { bgPortRequest } from '../../core/communication/bg-port';
import { IExtensionResponse, IExtensionRequest } from '../../core/communication/extension';
import { AccountConnectComponent } from './account-connect/account-connect';
import bind from 'bind-decorator';
import { NativeForwardComponent } from './native-forward/native-forward';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { Button } from '../../library';
import { translate } from '../../core/i18n';

interface IState {
    requestId: string;
    request: IExtensionRequest;
}

export class ExtensionBackgroundRequestComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props) {
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
                // set error in state and dispplay an error message...
            });
    }

    @bind
    onResponse(response) {
        bgPortRequest({
            origin: document.location.href,
            controller: 'ScreenController',
            method: 'setResponse',
            params: [this.state.requestId, { data: response }]
        });
        window.close();
    }

    renderLoading() {
        const { styles } = this.props;

        return (
            <View style={styles.loadingWrapper}>
                <View style={styles.loadingHeaderContainer}>
                    <Image
                        source={require('../../assets/images/png/moonlet_logo.png')}
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
                <Button
                    onPress={() => {
                        // TODO: maybe add here anything else which is necessary
                        window.close();
                    }}
                >
                    {translate('App.labels.cancel')}
                </Button>
            </View>
        );
    }

    renderScreen() {
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
                return this.renderLoading();
        }
    }

    render() {
        // console.log(JSON.stringify(this.state, null, 4));

        return <View style={this.props.styles.container}>{this.renderScreen()}</View>;
    }
}

export const ExtensionBackgroundRequest = smartConnect(ExtensionBackgroundRequestComponent, [
    withTheme(stylesProvider)
]);
