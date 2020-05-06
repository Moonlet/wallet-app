import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import LottieView from 'lottie-react-native';

export class SplashScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public animation: LottieView;

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
            </View>
        );
    }
}

export const SplashScreen = smartConnect(SplashScreenComponent, [withTheme(stylesProvider)]);
