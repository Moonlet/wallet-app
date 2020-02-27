import React from 'react';
import { View, Platform } from 'react-native';
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
    animation: LottieView;
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            showCancelButton: false
        };

        Platform.OS === 'web' &&
            setTimeout(() => {
                this.setState({ showCancelButton: true });
            }, 2800);
    }

    public resetSession() {
        WalletConnectWeb.disconnect();
        location.reload();
    }

    public renderCancelButton() {
        return (
            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 15 }}>Connecting to phone...</Text>
                <Button
                    onPress={() => {
                        this.resetSession();
                    }}
                >
                    Cancel
                </Button>
            </View>
        );
    }

    public loopAnimation() {
        this.animation.play(40, 120);
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={styles.lottieWrapper}>
                    <LottieView
                        source={require('../../assets/logo/logo-animation.json')}
                        style={styles.lottie}
                        autoPlay
                        loop={false}
                        ref={animation => {
                            this.animation = animation;
                        }}
                        onAnimationFinish={() => this.loopAnimation()}
                    />
                </View>
                <View style={{ height: 160 }}>
                    {this.state.showCancelButton && this.renderCancelButton()}
                </View>
            </View>
        );
    }
}

export const SplashScreen = smartConnect(SplashScreenComponent, [withTheme(stylesProvider)]);
