import React from 'react';
import { bgPortRequest } from '../../core/communication/bg-port';
import { IExtensionResponse, IExtensionRequest } from '../../core/communication/extension';

interface IState {
    request: IExtensionRequest;
}

export class ExtensionBackgroundRequest extends React.Component<any, IState> {
    constructor(props) {
        super(props);

        const requestId = document.location.hash.substring(1);

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

    render() {
        return <pre style={{ color: 'white' }}>{JSON.stringify(this.state, null, 4)}</pre>;
    }
}
