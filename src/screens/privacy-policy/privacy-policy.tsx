import React from 'react';
import { Image, View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { Text } from '../../library';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export const navigationOptions = () => ({
    title: translate('App.labels.privacyPolicy')
});

export class PrivacyPolicyScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.logoImage}
                    source={require('../../assets/images/png/moonlet_space.png')}
                />
                <Text style={styles.launchingSoonText}>{translate('Rewards.launchingSoon')}</Text>
            </View>
        );
    }
}

export const PrivacyPolicyScreen = smartConnect(PrivacyPolicyScreenComponent, [
    withTheme(stylesProvider)
]);
