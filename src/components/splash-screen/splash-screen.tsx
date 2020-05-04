import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import LottieView from 'lottie-react-native';
import { Button, Text } from '../../library';
import { WalletConnectWeb } from '../../core/wallet-connect/wallet-connect-web.web';

interface IState {
    showCancelButton: boolean;
}

export class SplashScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public animation: LottieView;
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            showCancelButton: false
        };

        // Platform.OS === 'web' && setTimeout(() => this.setState({ showCancelButton: true }), 2800);
    }

    public resetSession() {
        // TODO: WalletConnectWeb
        WalletConnectWeb.disconnect();
        location.reload();
    }

    public renderCancelButton() {
        const { styles } = this.props;

        return (
            <View style={styles.connectingPhoneContainer}>
                <Text style={styles.connectingText}>{`Connecting to phone...`}</Text>
                <Button onPress={() => this.resetSession()}>{`Cancel`}</Button>
            </View>
        );
    }

    public loopAnimation() {
        this.animation.play(40, 120);
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.lottieWrapper}>
                    <LottieView
                        ref={animation => (this.animation = animation)}
                        source={require('../../assets/logo/logo-animation.json')}
                        style={styles.lottie}
                        autoPlay
                        loop={false}
                        onAnimationFinish={() => this.loopAnimation()}
                    />
                </View>
                {/* {this.state.showCancelButton && this.renderCancelButton()} */}
            </View>
        );
    }
}

export const SplashScreen = smartConnect(SplashScreenComponent, [withTheme(stylesProvider)]);
