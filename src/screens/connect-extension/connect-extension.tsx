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
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Image
                        style={styles.moonletImage}
                        source={require('../../assets/images/png/moonlet_space_gray.png')}
                    />
                    <Text style={styles.quicklyConnectText}>
                        {translate('ConnectExtension.body')}
                    </Text>
                </View>

                {!WalletConnectClient.isConnected() && (
                    <Button
                        primary
                        onPress={() => this.qrCodeScanner.open()}
                        style={styles.scanButton}
                    >
                        {translate('ConnectExtension.buttonScan')}
                    </Button>
                )}

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
