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
import { Icon } from '../../components/icon/icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DialogComponent } from '../../components/dialog/dialog-component';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { Dialog } from '../../components/dialog/dialog';
import { getUrlParams } from '../../core/connect-extension/utils';
import { IQRCodeConn } from '../../core/connect-extension/types';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { IconValues } from '../../components/icon/values';

const qrCodeRegex = /^mooonletExtSync:([^\@]*)\@([^\/\?]*)([^\?]*)?\??(.*)/;

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
            const connection = await ConnectExtensionWeb.getConnection();

            if (connection) {
                this.setState({
                    isConnected: true,
                    os: connection?.os,
                    platform: connection?.platform
                });

                await ConnectExtension.syncExtension(connection);
            }

            this.setState({ isLoading: false });
        } catch {
            this.setState({ isLoading: false });
        }
    }

    private extractQrCodeData(value: string): IQRCodeConn {
        const connection: IQRCodeConn = {
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

    private async connExtension(value: string) {
        this.setState({ isLoading: true });

        const connection = this.extractQrCodeData(value);

        if (connection.connectionId && connection.encKey) {
            this.setState({
                os: connection.os,
                platform: connection.platform
            });

            const res = await ConnectExtensionWeb.storeConnection(connection);
            // @ts-ignore - ignore for web
            if (res === true) {
                this.setState({ isConnected: true });
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
            this.connExtension(value);
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

            await ConnectExtensionWeb.disconnect();

            this.setState({ isLoading: false, isConnected: false });
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
                                        name={IconValues.MONITOR}
                                        size={normalize(32)}
                                        style={styles.computerIcon}
                                    />
                                    <View style={styles.connDetailscontainer}>
                                        <Text style={styles.connectionInfoText}>
                                            {translate('ConnectExtension.currentlyActive')}
                                        </Text>
                                        <View style={styles.extraInfoContainer}>
                                            {platform && (
                                                <Text style={styles.extraInfo}>{platform}</Text>
                                            )}
                                            {os && <Text style={styles.extraInfo}>{os}</Text>}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => this.disconnectExtension()}>
                                        <Icon
                                            name={IconValues.FLASH_OFF}
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
                            leftIcon={IconValues.QR_CODE_SCAN}
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
