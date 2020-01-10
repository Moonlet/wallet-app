import React from 'react';
import { View, Image, Clipboard } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { Text, Button } from '../../library';
import { getApnsToken } from '../../core/messaging/silent/ios-voip-push-notification';
import { QrModalReader } from '../../components/qr-modal/qr-modal';
import { WalletConnectClient } from '../../core/wallet-connect/wallet-connect-client';

export const navigationOptions = () => ({
    headerLeft: <HeaderIcon />,
    title: translate('App.labels.watch')
});

export class WatchScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;
    public qrCodeScanner: any;

    public getCurrentToken = () => {
        Notifications.getToken().then(token => {
            Clipboard.setString(token);
        });
    };

    public getApnsToken = () => {
        Clipboard.setString(getApnsToken());
    };

    public onQrCodeScanned = async (value: string) => {
        WalletConnectClient.connect(value);
    };

    public connect = () => {
        this.qrCodeScanner.open();
    };
    public reconnect = () => {
        WalletConnectClient.reconnect();
    };

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.logoImage}
                    source={require('../../assets/images/png/moonlet_space.png')}
                />
                <Text style={styles.launchingSoonText}>{translate('Rewards.launchingSoon')}</Text>

                <View style={[styles.buttonContainer, { flexDirection: 'column' }]}>
                    <View>
                        <Button style={styles.button} onPress={this.getCurrentToken}>
                            <Text>Copy fb token</Text>
                        </Button>
                        <Button style={styles.button} onPress={this.getApnsToken}>
                            <Text>Copy ios token</Text>
                        </Button>
                        <Button
                            style={styles.button}
                            onPress={() => {
                                this.connect();
                            }}
                        >
                            <Text>WC</Text>
                        </Button>
                        <Button
                            style={styles.button}
                            onPress={() => {
                                this.reconnect();
                            }}
                        >
                            <Text>Reconnect</Text>
                        </Button>
                    </View>
                </View>
                <QrModalReader
                    ref={ref => (this.qrCodeScanner = ref)}
                    onQrCodeScanned={this.onQrCodeScanned}
                />
            </View>
        );
    }
}

export const WatchScreen = smartConnect(WatchScreenComponent, [withTheme(stylesProvider)]);
