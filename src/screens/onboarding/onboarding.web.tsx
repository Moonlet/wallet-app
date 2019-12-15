import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '../../library';
import { NavigationActions } from 'react-navigation';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import QRCode from 'qrcode';
import { WalletConnectWeb } from '../../core/wallet-connect/wallet-connect-web';

export interface IReduxProps {
    createHDWallet: (mnemonic: string, password: string, callback: () => any) => void;
}

export class OnboardingScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public qrCanvas: HTMLCanvasElement;
    public unsubscribe: () => void;

    constructor(props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    public componentDidMount() {
        if (!WalletConnectWeb.isConnected()) {
            WalletConnectWeb.connect().then(uri => {
                // store the uri?

                QRCode.toCanvas(this.qrCanvas, uri, { errorCorrectionLevel: 'H' });
                this.unsubscribe = WalletConnectWeb.subscribe('connect', payload => {
                    // console.log(payload);

                    this.props.navigation.navigate(
                        'MainNavigation',
                        {},
                        NavigationActions.navigate({ routeName: 'Dashboard' })
                    );
                });
            });
        }
    }

    public componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    public onPressDisconnect() {
        WalletConnectWeb.disconnect();
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View
                        style={{
                            alignItems: 'center',
                            alignSelf: 'stretch'
                        }}
                    >
                        <Image
                            style={styles.logoImage}
                            source={require('../../assets/images/png/moonlet_space.png')}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text large style={{ fontWeight: 'bold' }}>
                            {translate('Onboarding.welcomeTitle')}
                        </Text>
                        <Text style={{ textAlign: 'center', marginTop: 12 }} darker>
                            {translate('Onboarding.welcomeTextWeb')}
                        </Text>
                    </View>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <canvas ref={ref => (this.qrCanvas = ref)}></canvas>
                </View>
            </View>
        );
    }
}

export const OnboardingScreen = smartConnect(OnboardingScreenComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
