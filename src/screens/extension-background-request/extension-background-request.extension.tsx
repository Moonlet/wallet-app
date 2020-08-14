import React from 'react';
import { bgPortRequest } from '../../core/communication/bg-port';
import { IExtensionResponse, IExtensionRequest } from '../../core/communication/extension';
import { View, Text } from 'react-native';
import { AccountConnectComponent } from './account-connect/account-connect';
import bind from 'bind-decorator';
import { NativeForwardComponent } from './native-forward/native-forward';

interface IState {
    requestId: string;
    request: IExtensionRequest;
}

export class ExtensionBackgroundRequest extends React.Component<any, IState> {
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
                // should display a loader
                return <Text>Loading...</Text>;
        }
    }

    render() {
        return (
            <View>
                <pre style={{ color: 'white' }}>{JSON.stringify(this.state, null, 4)}</pre>
                {this.renderScreen()}
            </View>
        );
    }
}
