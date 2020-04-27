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
import { WC_CONNECTION } from '../../core/constants/app';
import { Notifications } from '../../core/messaging/notifications/notifications';
import CONFIG from '../../config';
import { sha256 } from 'js-sha256';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { isQrCodeValid, qrCodeRegex, qrCodeRegexExtraInfo } from '../../core/utils/format-number';
import { getBaseEncryptionKey } from '../../core/secure/keychain';
import { Dialog } from '../../components/dialog/dialog';

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
            const connectionStorage = await readEncrypted(WC_CONNECTION, keychainPassword);

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

    private async connectOrUpdateExtension(value: string) {
        this.setState({ isLoading: true });

        const valueSplit = value.split(qrCodeRegex);
        let extraValueSplit = valueSplit[4].split(qrCodeRegexExtraInfo);
        extraValueSplit = extraValueSplit.filter(val => val !== '' && val !== '=' && val !== '&');

        const obj = {
            connectionId: valueSplit[1],
            encKey: extraValueSplit[0] === 'encKey' && extraValueSplit[1],
            os: extraValueSplit[2] === 'os' && extraValueSplit[3].replace('%20', ' '),
            platform: extraValueSplit[4] === 'browser' && extraValueSplit[5]
        };

        this.setState({
            os: obj?.os,
            platform: obj?.platform
        });

        // Store connection
        const keychainPassword = await getBaseEncryptionKey();
        if (keychainPassword) {
            storeEncrypted(JSON.stringify(obj), WC_CONNECTION, keychainPassword);
        }

        // TODO: data json stringify state de app sanitise
        const data = 'thisDataIsEncrypted!';

        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                connectionId: obj.connectionId,
                data,
                authToken: sha256(obj.encKey),
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
                const connectionStorage = await readEncrypted(WC_CONNECTION, keychainPassword);

                if (connectionStorage) {
                    const connectionId = JSON.parse(connectionStorage).connectionId;
                    const authToken = JSON.parse(connectionStorage).encKey;

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
                        .then(async res => {
                            if (res?.success === true) {
                                // Delete connection from async storage
                                await deleteFromStorage(WC_CONNECTION);
                                this.setState({ isConnected: false, isLoading: false });
                            } else {
                                this.setState({ isLoading: false });
                            }
                        })
                        .catch(() => this.setState({ isLoading: false }));
                } else {
                    this.setState({ isLoading: false });
                }
            } catch (err) {
                this.setState({ isLoading: false });
            }
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
