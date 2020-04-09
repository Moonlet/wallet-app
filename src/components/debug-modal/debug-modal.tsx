import React from 'react';
import { View, TouchableOpacity, Clipboard, Platform, ScrollView } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import Modal from '../../library/modal/modal';
import { Text, Button } from '../../library';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { getApnsToken } from '../../core/messaging/silent/ios-voip-push-notification';
import { readEncrypted } from '../../core/secure/storage';
import { WC_CONNECTION } from '../../core/constants/app';
import { getBaseEncryptionKey } from '../../core/secure/keychain';
import { WalletConnectClient } from '../../core/wallet-connect/wallet-connect-client';

export interface IExternalProps {
    obRef?: any;
    visible?: boolean;
}

interface IState {
    visible?: boolean;
    fcmToken?: string;
    apnToken?: string;
    wcSession?: any;
}

export class DebugModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            visible: props.visible || false
        };
        props.obRef && props.obRef(this);
    }

    public showDebug() {
        this.setState({ visible: true });
    }

    public async componentDidMount() {
        Notifications.getToken().then(fcmToken => {
            this.setState({
                fcmToken
            });
        });
        Platform.OS === 'ios' &&
            getApnsToken().then(apnToken => {
                this.setState({
                    apnToken
                });
            });
        getBaseEncryptionKey().then(async keychainPassword => {
            if (keychainPassword) {
                try {
                    this.setState({
                        wcSession: JSON.parse(await readEncrypted(WC_CONNECTION, keychainPassword))
                    });
                } catch (e) {
                    // @ts-ignore
                }
            }
        });
    }

    private displayInfo(text: string, label?: string) {
        return (
            <TouchableOpacity
                style={this.props.styles.row}
                onPress={() => Clipboard.setString(text)}
            >
                {label && <Text darker>{label}</Text>}
                <Text>{text}</Text>
            </TouchableOpacity>
        );
    }

    public render() {
        return (
            <Modal isVisible={this.state.visible}>
                <View style={this.props.styles.container}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View>
                            {this.displayInfo(this.state.fcmToken, 'FCM token')}
                            {Platform.OS === 'ios' &&
                                this.displayInfo(this.state.apnToken, 'APN token')}
                            {this.displayInfo(
                                this.state.wcSession?.connected
                                    ? 'connected'
                                    : 'not connected / unk',
                                'WC connection'
                            )}
                            {this.displayInfo(this.state.wcSession?.bridge, 'WC bridge')}
                            {this.displayInfo(this.state.wcSession?.key, 'WC key')}
                            {this.displayInfo(this.state.wcSession?.clientId, 'WC client id')}
                            {this.displayInfo(this.state.wcSession?.peerId, 'WC peer id')}
                            {this.displayInfo(
                                this.state.wcSession?.handshakeId,
                                'WC handshakeId id'
                            )}
                            {this.displayInfo(
                                this.state.wcSession?.handshakeTopic,
                                'WC handshake topic'
                            )}
                        </View>
                    </ScrollView>

                    <Button
                        onPress={() => WalletConnectClient.reconnect()}
                        style={this.props.styles.button}
                    >
                        {`Reconnect to WC`}
                    </Button>
                    <Button onPress={() => this.setState({ visible: false })}>{`Back`}</Button>
                </View>
            </Modal>
        );
    }
}

export const DebugModal = smartConnect<IExternalProps>(DebugModalComponent, [
    withTheme(stylesProvider)
]);
