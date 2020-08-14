import React from 'react';
import { Button } from '../../../library';
import { View } from 'react-native';

interface IProps {
    onResponse: (response) => any;
}

export class AccountConnectComponent extends React.Component<IProps> {
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
                            result: ['0x1', '0x2']
                        })
                    }
                >
                    Authorize
                </Button>
            </View>
        );
    }
}
