import React from 'react';
import { View, TouchableOpacity, Platform, ScrollView, TextInput } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import Modal from '../../library/modal/modal';
import { Text, Button } from '../../library';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { readEncrypted } from '../../core/secure/storage/storage';
import { WC_CONNECTION } from '../../core/constants/app';
import { getBaseEncryptionKey } from '../../core/secure/keychain/keychain';
import { NavigationService } from '../../navigation/navigation-service';

interface IExternalProps {
    obRef?: any;
    visible?: boolean;
}

interface IState {
    visible?: boolean;
    fcmToken?: string;
    apnToken?: string;
    wcSession?: any;
    solanaAddress?: string;
    solanaEpoch?: string;
}

class DebugModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            visible: props.visible || false,
            solanaAddress: undefined,
            solanaEpoch: undefined
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
                        contentContainerStyle={{ flexGrow: 1, marginTop: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View>
                            {this.displayInfo(this.state.fcmToken, 'FCM token')}
                            {Platform.OS === 'ios' &&
                                this.displayInfo(this.state.apnToken, 'APN token')}
                            {/* {this.displayInfo(
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
                            )} */}

                            <View style={this.props.styles.inputBox}>
                                <TextInput
                                    style={this.props.styles.input}
                                    placeholderTextColor={this.props.theme.colors.textTertiary}
                                    placeholder={'Solana address'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    selectionColor={this.props.theme.colors.accent}
                                    value={this.state.solanaAddress}
                                    onChangeText={value => this.setState({ solanaAddress: value })}
                                />
                            </View>

                            <Button
                                onPress={() => {
                                    this.setState({ visible: false });
                                    NavigationService.navigate('SmartScreen', {
                                        context: {
                                            screen: 'DevRewards',
                                            params: {
                                                address:
                                                    this.state.solanaAddress ||
                                                    '6S1ZJioKaJX3MGjTSudxNw4pT1GZD7tN1eSmeoZEgkHu'
                                            }
                                        },
                                        navigationOptions: { title: 'Rewards' },
                                        newFlow: true
                                    });
                                }}
                            >
                                {`Solana rewards`}
                            </Button>
                        </View>
                    </ScrollView>

                    <Button onPress={() => this.setState({ visible: false })}>{`Back`}</Button>
                </View>
            </Modal>
        );
    }
}

export const DebugModal = smartConnect<IExternalProps>(DebugModalComponent, [
    withTheme(stylesProvider)
]);
