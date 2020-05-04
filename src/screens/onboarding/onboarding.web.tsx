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
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web.web';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';

const navigationOptions = () => ({ header: null });

export interface IState {
    isLoading: boolean;
}

// const connectionId = '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000';
// const encKey = '5be0e4c3a239e0027783a2e9c3bd8999cc450f777198156b3ff4f4a3e8b6c691';

const connectionId = 'c5605761-64a5-457d-b478-2a04845b96a6';
const encKey =
    'zk6LqiKTTiV8kBF8Uh7ix7woJHFkdTPDfMzg23zMu9iMjkXelBcS9eKV7REQUM1iiSKwf3Juzj49AIPkToCr2w==';

const os = 'Windows%2010';
const platform = 'Chrome';

export class OnboardingScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public qrCanvas: HTMLCanvasElement;

    constructor(props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    public async componentDidMount() {
        await ConnectExtensionWeb.isConnected();

        const uri = `mooonletExtSync:${connectionId}@firebase/?encKey=${encKey}&os=${os}&browser=${platform}`;
        QRCode.toCanvas(this.qrCanvas, uri, { errorCorrectionLevel: 'H' });
        await ConnectExtensionWeb.test({
            connectionId,
            encKey,
            os,
            platform
        });

        // try {
        //     if (await ConnectExtensionWeb.isConnected()) {
        //         // Get State
        //         const state = ConnectExtensionWeb.getState();
        //         console.log('state: ', state);
        //         if (state) {
        //             // Navigate to Dashboard
        //             this.props.navigation.navigate(
        //                 'MainNavigation',
        //                 {},
        //                 NavigationActions.navigate({ routeName: 'Dashboard' })
        //             );
        //         } else {
        //             // State has not been loaded!
        //         }
        //     } else {
        //         this.setState({ isLoading: true });
        //         const res = await ConnectExtensionWeb.generateQRCodeUri();
        //         console.log(res.conn);
        //         this.setState({ isLoading: false });
        //         await QRCode.toCanvas(this.qrCanvas, res.uri, { errorCorrectionLevel: 'H' });
        //         await ConnectExtensionWeb.listenLastSync(res.conn);
        //     }
        // } catch {
        //     this.setState({ isLoading: false });
        // }
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                {this.state.isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={styles.topContainer} testID="welcome-text">
                            <Text large style={styles.welcomeTitle}>
                                {translate('Onboarding.welcomeTitle')}
                            </Text>
                            <Text style={styles.welcomeTextWeb}>
                                {translate('Onboarding.welcomeTextWeb')}
                            </Text>
                        </View>

                        <View style={styles.canvas}>
                            <canvas
                                ref={ref => (this.qrCanvas = ref)}
                                style={{ textAlign: 'center' }}
                            />
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
                )}
            </View>
        );
    }
}

export const OnboardingScreen = smartConnect(OnboardingScreenComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
