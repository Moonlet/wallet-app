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
import { getPassword } from '../../core/secure/keychain';
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

const displayInfo = (text: string, label?: string) => (
    <TouchableOpacity
        style={{
            flexDirection: 'column',
            paddingVertical: 8
        }}
        onPress={async () => {
            await Clipboard.setString(text);
        }}
    >
        {label && <Text small darker>{label}</Text>}
        <Text small>{text}</Text>
    </TouchableOpacity>
);

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
        this.setState({
            visible: true
        });
    }

    public async componentDidMount() {
        this.setState({
            fcmToken: await Notifications.getToken(),
            apnToken: Platform.OS === 'ios' ? await getApnsToken() : '',
            wcSession: await getPassword().then(
                async keychainPassword =>
                    keychainPassword &&
                    JSON.parse(await readEncrypted(WC_CONNECTION, keychainPassword.password))
            )
        });
    }

    public render() {
        return (
            <View
                style={{
                    display: this.state.visible ? 'flex' : 'none',
                    position: 'absolute',
                    height: '100%'
                }}
            >
                <Modal isVisible={this.state.visible}>
                    <View style={this.props.styles.container}>
                        <ScrollView style={{ flex: 1 }}>
                            <View>
                                {displayInfo(this.state.fcmToken, 'FCM token')}
                                {Platform.OS === 'ios' &&
                                    displayInfo(this.state.apnToken, 'APN token')}
                                {displayInfo(
                                    this.state.wcSession?.connected
                                        ? 'connected'
                                        : 'not connected / unk',
                                    'WC connection'
                                )}
                                {displayInfo(this.state.wcSession?.bridge, 'WC bridge')}
                                {displayInfo(this.state.wcSession?.key, 'WC key')}
                                {displayInfo(this.state.wcSession?.clientId, 'WC client id')}
                                {displayInfo(this.state.wcSession?.peerId, 'WC peer id')}
                                {displayInfo(
                                    this.state.wcSession?.handshakeId,
                                    'WC handshakeId id'
                                )}
                                {displayInfo(
                                    this.state.wcSession?.handshakeTopic,
                                    'WC handshake topic'
                                )}
                            </View>
                        </ScrollView>
                        <View style={{ flex: 0, padding: 20 }}>
                            <Button
                                onPress={() => {
                                    WalletConnectClient.reconnect();
                                }}
                            >
                                Reconnect to WC
                            </Button>
                            <Button
                                onPress={() => {
                                    this.setState({
                                        visible: false
                                    });
                                }}
                            >
                                Back
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export const DebugModal = smartConnect<IExternalProps>(DebugModalComponent, [
    withTheme(stylesProvider)
]);
