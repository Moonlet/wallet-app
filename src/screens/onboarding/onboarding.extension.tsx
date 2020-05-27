import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { NavigationActions } from 'react-navigation';
import stylesProvider from './styles-web';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import QRCode from 'qrcode';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';

const navigationOptions = () => ({ header: null });

export class OnboardingScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;
    public qrCanvas: HTMLCanvasElement;

    public async componentDidMount() {
        try {
            if (await ConnectExtensionWeb.isConnected()) {
                this.props.navigation.navigate(
                    'MainNavigation',
                    {},
                    NavigationActions.navigate({ routeName: 'Dashboard' })
                );
            } else {
                const res = await ConnectExtensionWeb.generateQRCodeUri();
                QRCode.toCanvas(this.qrCanvas, res.uri, { errorCorrectionLevel: 'H' });
                ConnectExtensionWeb.listenLastSyncForConnect(res.conn);
            }
        } catch {
            //
        }
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
