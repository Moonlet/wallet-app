import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
// import { NavigationActions } from 'react-navigation';
import stylesProvider from './styles-web';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import QRCode from 'qrcode';
import { database } from 'firebase';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension.web';
import { decrypt } from '../../core/secure/encrypt.web';
import CryptoJS from 'crypto-js';
import { IQRCode } from '../../core/connect-extension/types';

const navigationOptions = () => ({ header: null });

export class OnboardingScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;
    public qrCanvas: HTMLCanvasElement;
    public connectExtensionWeb = new ConnectExtensionWeb();

    public async componentDidMount() {
        if (this.connectExtensionWeb.isConnected()) {
            //
        } else {
            // Connect Extension
            const res = await this.connectExtensionWeb.generateQRCodeUri();
            await QRCode.toCanvas(this.qrCanvas, res.uri, { errorCorrectionLevel: 'H' });
            await this.listenLastSync(res.conn);
        }

        //     if (!WalletConnectWeb.isConnected()) {
        //         WalletConnectWeb.connect().then(uri => {
        //             QRCode.toCanvas(this.qrCanvas, uri, { errorCorrectionLevel: 'H' });
        //             this.unsubscribe = WalletConnectWeb.subscribe('connect', payload => {
        //                 WalletConnectWeb.getState().then(() => {
        //                     this.props.navigation.navigate(
        //                         'MainNavigation',
        //                         {},
        //                         NavigationActions.navigate({ routeName: 'Dashboard' })
        //                     );
        //                 });
        //             });
        //         });
        //     }
    }

    private async listenLastSync(conn: IQRCode) {
        // RealtimeDB
        const realtimeDB = database().ref('extensionSync');
        const connections = realtimeDB.child('connections');
        connections.child(conn.connectionId).on('value', async (snapshot: any) => {
            const snap = snapshot.val();

            if (snap?.lastSynced && snap?.authToken) {
                try {
                    // Extension the state from Firebase Storage
                    const extState = await this.connectExtensionWeb.downloadFileStorage(
                        conn.connectionId
                    );

                    if (extState) {
                        // const encKey1 = snap.authToken;
                        // console.log('encKey: ', encKey1);

                        const decryptedState = JSON.parse(
                            decrypt(extState, conn.encKey).toString(CryptoJS.enc.Utf8)
                        );

                        // Save state
                        // console.log('decryptedState: ', decryptedState);
                        return decryptedState;
                    } else {
                        //
                    }
                } catch (err) {
                    // console.log('EROARE: ', err);
                }
            } else {
                // Connection does not exist
                // console.log('Connection does not exist! Waiting for connections...');
            }
        });
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.topContainer} testID="welcome-text">
                    <Text large style={styles.welcomeTitle}>
                        {translate('Onboarding.welcomeTitle')}
                    </Text>
                    <Text style={styles.welcomeTextWeb}>
                        {translate('Onboarding.welcomeTextWeb')}
                    </Text>
                </View>

                <View style={styles.canvas}>
                    <canvas ref={ref => (this.qrCanvas = ref)} style={{ textAlign: 'center' }} />
                </View>

                <View style={styles.bottomContainer}>
                    <View style={styles.infoRow}>
                        <View key="circle-1" style={styles.circle}>
                            <Text key="number-1" style={styles.number}>{`1`}</Text>
                        </View>
                        <Text style={styles.text}>{translate('Onboarding.webStep1')}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View key="circle-2" style={styles.circle}>
                            <Text key="number-2" style={styles.number}>{`2`}</Text>
                        </View>
                        <Text style={styles.text}>{translate('Onboarding.webStep2')}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View key="circle-3" style={styles.circle}>
                            <Text key="number-3" style={styles.number}>{`3`}</Text>
                        </View>
                        <Text style={styles.text}>{translate('Onboarding.webStep3')}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export const OnboardingScreen = smartConnect(OnboardingScreenComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
