import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from '../../library';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { QrModalReader } from '../../components/qr-modal/qr-modal';
import bind from 'bind-decorator';
import { normalize } from '../../styles/dimensions';
import { Icon } from '../../components/icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DialogComponent } from '../../components/dialog/dialog-component';
// import { storeEncrypted, deleteFromStorage, getItemFromStorage } from '../../core/secure/storage';
// import { WC_CONNECTION } from '../../core/constants/app';
import { Notifications } from '../../core/messaging/notifications/notifications';
import CONFIG from '../../config';
import { sha256 } from 'js-sha256';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';

export const navigationOptions = () => ({
    title: translate('ConnectExtension.title')
});

interface IState {
    isConnected: boolean;
    isLoading: boolean;
}

export class ConnectExtensionScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public qrCodeScanner: any;

    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            isConnected: false,
            isLoading: false
        };
    }

    public componentDidMount() {
        const value =
            'mooonletExtSync:11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000@firebase/?encKey=ODMyNjY0NjA2NjcyNDQ1NTExODQxMmEyM2FmZGVhYjM=&os=windows%2010&browser=chrome';
        this.connectOrUpdateExtension(value);
    }

    private async connectOrUpdateExtension(value: string) {
        this.setState({ isLoading: true });
        // 1. AsyncStorage
        // 11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000
        // ODMyNjY0NjA2NjcyNDQ1NTExODQxMmEyM2FmZGVhYjM='
        // os
        // browser => Chrome, MacOS
        // store connection data - using base encryption

        const connectionId = '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000';
        const authToken = 'ODMyNjY0NjA2NjcyNDQ1NTExODQxMmEyM2FmZGVhYjM=';

        // TODO: data json stringify state de app sanitise
        const data = 'thisDataIsEncrypted!';

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                connectionId,
                data,
                authToken: sha256(authToken),
                fcmToken: await Notifications.getToken()
            })
        };

        fetch(CONFIG.extSyncUpdateStateUrl, request)
            .then(res => res.json())
            .then(res => {
                if (res?.success === true) {
                    this.setState({ isConnected: true, isLoading: false });
                } else {
                    this.setState({ isConnected: false, isLoading: false });
                }
            })
            .catch(() => this.setState({ isConnected: false, isLoading: false }));
    }

    @bind
    private async onQrCodeScanned(value: string) {
        this.connectOrUpdateExtension(value);
    }

    private async disconnectExtension() {
        if (
            await DialogComponent.confirm(
                translate('ConnectExtension.disconnect'),
                translate('ConnectExtension.disconnectInfo')
            )
        ) {
            this.setState({ isLoading: true });
            // deleteFromStorage(WC_CONNECTION);

            const connectionId = '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000';
            const authToken = 'ODMyNjY0NjA2NjcyNDQ1NTExODQxMmEyM2FmZGVhYjM=';

            const request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    connectionId,
                    authToken: sha256(authToken)
                })
            };

            fetch(CONFIG.extSyncDisconnectUrl, request)
                .then(res => res.json())
                .then(res => {
                    if (res?.success === true) {
                        this.setState({ isConnected: false, isLoading: false });
                    } else {
                        this.setState({ isLoading: false });
                    }
                })
                .catch(() => this.setState({ isLoading: false }));
        }
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                {this.state.isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <View style={{ flex: 1 }}>
                        {this.state.isConnected ? (
                            <View style={styles.connectionsContainer}>
                                <View style={styles.connectionBox}>
                                    <Icon
                                        name="monitor"
                                        size={normalize(32)}
                                        style={styles.computerIcon}
                                    />
                                    <Text style={styles.connectionInfoText}>
                                        {translate('ConnectExtension.currentlyActive')}
                                    </Text>
                                    <TouchableOpacity onPress={() => this.disconnectExtension()}>
                                        <Icon
                                            name="flash-off"
                                            size={normalize(32)}
                                            style={styles.flashIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Image
                                    style={styles.moonletImage}
                                    source={require('../../assets/images/png/moonlet_space_gray.png')}
                                />
                                <Text style={styles.quicklyConnectText}>
                                    {translate('ConnectExtension.body')}
                                </Text>
                            </View>
                        )}

                        <Button
                            primary
                            onPress={() => {
                                const value =
                                    'mooonletExtSync:11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000@firebase/?encKey=ODMyNjY0NjA2NjcyNDQ1NTExODQxMmEyM2FmZGVhYjM=&os=windows%2010&browser=chrome';
                                this.connectOrUpdateExtension(value);

                                // TODO
                                // this.qrCodeScanner.open();
                            }}
                            style={styles.scanButton}
                            disabled={this.state.isConnected}
                            leftIcon="qr-code-scan"
                        >
                            {translate('ConnectExtension.buttonScan')}
                        </Button>

                        <QrModalReader
                            obRef={ref => (this.qrCodeScanner = ref)}
                            onQrCodeScanned={this.onQrCodeScanned}
                        />
                    </View>
                )}
            </View>
        );
    }
}

export const ConnectExtensionScreen = smartConnect(ConnectExtensionScreenComponent, [
    withTheme(stylesProvider)
]);
