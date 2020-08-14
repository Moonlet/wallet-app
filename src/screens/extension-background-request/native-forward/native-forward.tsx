import React from 'react';
import { Button } from '../../../library';
import { View } from 'react-native';
import { IExtensionRequest } from '../../../core/communication/extension';

interface IProps {
    requestId: string;
    request: IExtensionRequest;
    onResponse: (response) => any;
}

export class NativeForwardComponent extends React.Component<IProps> {
    render() {
        return (
            <View>
                <Button
                    secondary
                    onPress={() =>
                        this.props.onResponse({
                            jsonrpc: '2.0',
                            error: {
                                code: -1,
                                message: 'CANCELED_BY_USER: Operation cancelled by user'
                            }
                        })
                    }
                >
                    Cancel
                </Button>
                <Button
                    primary
                    onPress={() =>
                        this.props.onResponse({
                            jsonrpc: '2.0',
                            result: 'RESPONSE_FROM_NATIVE'
                        })
                    }
                >
                    Sign
                </Button>
            </View>
        );
    }
}
