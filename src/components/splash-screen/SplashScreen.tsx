import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import LottieView from 'lottie-react-native';

export class SplashScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
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
                        loop
                    />
                </View>
            </View>
        );
    }
}

export const SplashScreen = smartConnect(SplashScreenComponent, [withTheme(stylesProvider)]);
