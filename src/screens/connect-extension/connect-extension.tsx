import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from '../../library';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { WalletConnectClient } from '../../core/wallet-connect/wallet-connect-client';
import { QrModalReader } from '../../components/qr-modal/qr-modal';
import bind from 'bind-decorator';
import { normalize } from '../../styles/dimensions';
import { Icon } from '../../components/icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DialogComponent } from '../../components/dialog/dialog-component';

export const navigationOptions = () => ({
    title: translate('ConnectExtension.title')
});

export class ConnectExtensionScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;
    public qrCodeScanner: any;

    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    @bind
    private async onQrCodeScanned(value: string) {
        WalletConnectClient.connect(value);
        // this.forceUpdate();
    }

    private async disconnectExtension() {
        if (
            await DialogComponent.confirm(
                translate('ConnectExtension.disconnect'),
                translate('ConnectExtension.disconnectInfo')
            )
        ) {
            WalletConnectClient.disconnect();
            // this.forceUpdate();
        }
    }

    public render() {
        const { styles } = this.props;
        const isConnected = WalletConnectClient.isConnected();
        // console.log('isConnected: ', isConnected);

        return (
            <View style={styles.container}>
                {isConnected ? (
                    <View style={styles.connectionsContainer}>
                        <View style={styles.connectionBox}>
                            <Icon name="monitor" size={normalize(32)} style={styles.computerIcon} />
                            <Text style={styles.connectionInfoText}>{`Currently active`}</Text>
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
                    disabled={isConnected}
                >
                    {translate('ConnectExtension.buttonScan')}
                </Button>

                <QrModalReader
                    obRef={ref => (this.qrCodeScanner = ref)}
                    onQrCodeScanned={this.onQrCodeScanned}
                />
            </View>
        );
    }
}

export const ConnectExtensionScreen = smartConnect(ConnectExtensionScreenComponent, [
    withTheme(stylesProvider)
]);
