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
import { isQrCodeValid, qrCodeRegex, qrCodeRegexExtraInfo } from '../../core/utils/format-number';
import { getBaseEncryptionKey } from '../../core/secure/keychain';
import { Dialog } from '../../components/dialog/dialog';
import { trimState } from '../../core/connect-extension/conn-ext-state-helper';
import { store } from '../../redux/config';
import { encrypt } from '../../core/secure/encrypt';

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
            const keychainPassword = await getBaseEncryptionKey();
            const connectionStorage = await readEncrypted(CONN_EXTENSION, keychainPassword);

            if (connectionStorage) {
                this.setState({
                    isConnected: true,
                    os: JSON.parse(connectionStorage)?.os,
                    platform: JSON.parse(connectionStorage)?.platform
                });
            }

            this.setState({ isLoading: false });
        } catch {
            this.setState({ isLoading: false });
        }
    }

    private async extractQrCodeData(value: string): Promise<IQRCode> {
        const connection: IQRCode = {
            connectionId: undefined,
            encKey: undefined,
            os: undefined,
            platform: undefined
        };

        const valueSplit = value.split(qrCodeRegex);
        if (valueSplit[1]) {
            connection.connectionId = valueSplit[1];
        }

        let extraValueSplit = valueSplit[4] && valueSplit[4].split(qrCodeRegexExtraInfo);
        extraValueSplit =
            extraValueSplit &&
            extraValueSplit.filter(val => val !== '' && val !== '=' && val !== '&');

        if (extraValueSplit[0] && extraValueSplit[0] === 'encKey') {
            connection.encKey = extraValueSplit[1];
        }

        if (extraValueSplit[2] && extraValueSplit[2] === 'os') {
            connection.os = extraValueSplit[3].replace('%20', ' ');
        }

        if (extraValueSplit[4] && extraValueSplit[4] === 'browser') {
            connection.platform = extraValueSplit[5];
        }

        return connection;
    }

    private async connectOrUpdateExtension(value: string) {
        this.setState({ isLoading: true });

        const connection = await this.extractQrCodeData(value);

        if (connection.connectionId && connection.encKey) {
            this.setState({
                os: connection.os,
                platform: connection.platform
            });

            try {
                const request = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        connectionId: connection.connectionId,
                        data: await encrypt(
                            JSON.stringify(trimState(store.getState())),
                            connection.encKey
                        ),
                        authToken: sha256(connection.encKey),
                        fcmToken: await Notifications.getToken()
                    })
                };

                const updateStateResponse = await fetch(CONFIG.extSyncUpdateStateUrl, request);
                const resData = await updateStateResponse.json();

                if (resData?.success === true) {
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
                //
            }
        }

        this.setState({ isLoading: false });
    }

    @bind
    private async onQrCodeScanned(value: string) {
        if (isQrCodeValid(value)) {
            this.connectOrUpdateExtension(value);
        } else {
            Dialog.info(translate('App.labels.warning'), translate('ConnectExtension.qrCodeError'));
        }
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
                const connectionStorage = await readEncrypted(CONN_EXTENSION, keychainPassword);

                if (connectionStorage) {
                    const connectionId = JSON.parse(connectionStorage).connectionId;
                    const authToken = JSON.parse(connectionStorage).encKey;

                    const request = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            connectionId,
                            authToken: sha256(authToken)
                        })
                    };

                    try {
                        const disconnectResponse = await fetch(
                            CONFIG.extSyncDisconnectUrl,
                            request
                        );

                        const resData = await disconnectResponse.json();
                        if (resData?.success === true) {
                            // Delete connection from async storage
                            await deleteFromStorage(CONN_EXTENSION);
                            this.setState({ isConnected: false });
                        }
                    } catch {
                        //
                    }
                }
            } catch {
                //
            }

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
