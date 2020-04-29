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
import { database, storage } from 'firebase';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect.extension.web';
import { HttpClientWeb } from '../../core/utils/http-client.web';
// import { v4 as uuidv4 } from 'uuid';

const BUCKET = 'gs://moonlet-extension-sync';

const connectionId = '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000';
// const connectionId = uuidv4();
const encKey = '5be0e4c3a239e0027783a2e9c3bd8999cc450f777198156b3ff4f4a3e8b6c691';
const os = 'Windows%2010';
const platform = 'Chrome';

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
            await this.generateQrCode();
            await this.listenLastSync();
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

    private async generateQrCode() {
        const uri = `mooonletExtSync:${connectionId}@firebase/?encKey=${encKey}&os=${os}&browser=${platform}`;
        await QRCode.toCanvas(this.qrCanvas, uri, { errorCorrectionLevel: 'H' });
    }

    private async downloadStorage() {
        try {
            // Firebase Storage
            const urlDowndload = await storage()
                .refFromURL(BUCKET)
                .child(connectionId)
                .getDownloadURL();

            // console.log('urlDowndload: ', urlDowndload);

            const httpClientWeb = new HttpClientWeb();
            const data = await httpClientWeb.get(urlDowndload);
            // console.log('state: ', data);
            return data;
        } catch (err) {
            // console.log('ERROR: ', err);
            Promise.reject();
        }
    }

    private async listenLastSync() {
        // RealtimeDB
        const realtimeDB = database().ref('extensionSync');
        const connections = realtimeDB.child('connections');
        connections.child(connectionId).on('value', async (snapshot: any) => {
            const snap = snapshot.val();

            if (snap?.lastSynced) {
                // console.log('snap: ', snap);
                try {
                    // Extension Download
                    const extState = await this.downloadStorage();
                    // console.log('extState: ', extState);
                    // decrypt extState
                    // Save state
                    return extState;
                } catch (err) {
                    // console.log('EROARE: ', err);
                }
            } else {
                // Connection does not exist
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
