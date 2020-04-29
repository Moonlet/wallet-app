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
import { storeEncrypted, readEncrypted, deleteFromStorage } from '../../core/secure/storage';
import { CONN_EXTENSION } from '../../core/constants/app';
import { Notifications } from '../../core/messaging/notifications/notifications';
import CONFIG from '../../config';
import { sha256 } from 'js-sha256';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { getBaseEncryptionKey } from '../../core/secure/keychain';
import { Dialog } from '../../components/dialog/dialog';
import { extensionState } from '../../core/connect-extension/conn-ext-state-helper';
import { store } from '../../redux/config';
import { encrypt } from '../../core/secure/encrypt';
import { HttpClient } from '../../core/utils/http-client';
import { getUrlParams } from '../../core/connect-extension/utils';

const qrCodeRegex = /^mooonletExtSync:([^\@]*)\@([^\/\?]*)([^\?]*)?\??(.*)/;

export interface IQRCode {
    connectionId: string;
    encKey: string;
    os?: string;
    platform?: string;
}

export const navigationOptions = () => ({
    title: translate('ConnectExtension.title')
});

interface IState {
    isConnected: boolean;
    isLoading: boolean;
    os: string;
    platform: string;
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
            isLoading: false,
            os: undefined,
            platform: undefined
        };
    }

    public componentDidMount() {
        this.getConnectionAsyncStorage();
    }

    private async getConnectionAsyncStorage() {
        this.setState({ isLoading: true });

        try {
            const encryptionKey = await getBaseEncryptionKey();
            const connection = await readEncrypted(CONN_EXTENSION, encryptionKey);

            if (connection) {
                const connectionParse = JSON.parse(connection);
                this.setState({
                    isConnected: true,
                    os: connectionParse?.os,
                    platform: connectionParse?.platform
                });

                await this.syncExtension(connectionParse);
            }

            this.setState({ isLoading: false });
        } catch {
            this.setState({ isLoading: false });
        }
    }

    private extractQrCodeData(value: string): IQRCode {
        const connection: IQRCode = {
            connectionId: undefined,
            encKey: undefined,
            os: undefined,
            platform: undefined
        };

        const res = qrCodeRegex.exec(value);
        if (res) {
            const extraData: any = getUrlParams(res[4]);

            connection.connectionId = res[1];
            connection.encKey = extraData?.encKey;
            connection.os = extraData?.os;
            connection.platform = extraData?.browser;
        }

        return connection;
    }

    private async syncExtension(connection: any): Promise<any> {
        try {
            const http = new HttpClient(CONFIG.extSyncUpdateStateUrl);
            const res = await http.post('', {
                connectionId: connection.connectionId,
                data: await encrypt(
                    JSON.stringify(extensionState(store.getState())),
                    connection.encKey
                ),
                authToken: sha256(connection.encKey),
                fcmToken: await Notifications.getToken()
            });

            return res;
        } catch {
            Promise.reject();
        }
    }

    private async connectExtension(value: string) {
        this.setState({ isLoading: true });

        const connection = await this.extractQrCodeData(value);

        if (connection.connectionId && connection.encKey) {
            this.setState({
                os: connection.os,
                platform: connection.platform
            });

            try {
                const res = await this.syncExtension(connection);

                if (res?.success === true) {
                    // Extension has been connected
                    // Store connection
                    const keychainPassword = await getBaseEncryptionKey();
                    if (keychainPassword) {
                        storeEncrypted(
                            JSON.stringify(connection),
                            CONN_EXTENSION,
                            keychainPassword
                        );
                    }

                    this.setState({ isConnected: true });
                }
            } catch {
                Dialog.info(translate('App.labels.warning'), translate('ConnectExtension.error'));
            }
        } else {
            // Invalid QR Code pattern
            Dialog.info(translate('App.labels.warning'), translate('ConnectExtension.qrCodeError'));
        }

        this.setState({ isLoading: false });
    }

    @bind
    private async onQrCodeScanned(value: string) {
        if (qrCodeRegex.test(value)) {
            this.connectExtension(value);
        } else {
            Dialog.info(translate('App.labels.warning'), translate('ConnectExtension.qrCodeError'));
        }
    }

    private async deleteConnection() {
        // Delete connection from async storage
        await deleteFromStorage(CONN_EXTENSION);
        this.setState({ isConnected: false });
    }

    private async disconnectExtension() {
        if (
            await DialogComponent.confirm(
                translate('ConnectExtension.disconnect'),
                translate('ConnectExtension.disconnectInfo')
            )
        ) {
            this.setState({ isLoading: true });

            try {
                const keychainPassword = await getBaseEncryptionKey();
                const connection = await readEncrypted(CONN_EXTENSION, keychainPassword);

                if (connection) {
                    const connectionParse = JSON.parse(connection);
                    const connectionId = connectionParse.connectionId;
                    const authToken = connectionParse.encKey;

                    const http = new HttpClient(CONFIG.extSyncDisconnectUrl);
                    await http.post('', {
                        connectionId,
                        authToken: sha256(authToken)
                    });
                }
            } catch {
                //
            }

            await this.deleteConnection();

            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { styles } = this.props;
        const { os, platform } = this.state;

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
                                    <View style={styles.connDetailscontainer}>
                                        <Text style={styles.connectionInfoText}>
                                            {translate('ConnectExtension.currentlyActive')}
                                        </Text>
                                        <View style={styles.extraInfoContainer}>
                                            {os && <Text style={styles.extraInfo}>{os}</Text>}
                                            {platform && (
                                                <Text style={styles.extraInfo}>{platform}</Text>
                                            )}
                                        </View>
                                    </View>
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
                            onPress={() => this.qrCodeScanner.open()}
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
