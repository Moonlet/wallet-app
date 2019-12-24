import React from 'react';
import { View, Image, Clipboard } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { Text, Button } from '../../library';
import { getApnsToken } from '../../core/messaging/silent/ios-voip-push-notification';

export const navigationOptions = () => ({
    headerLeft: <HeaderIcon />,
    title: translate('App.labels.watch')
});

export class WatchScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public getCurrentToken = () => {
        Notifications.getToken().then(token => {
            Clipboard.setString(token);
        });
    };

    public getApnsToken = () => {
        Clipboard.setString(getApnsToken());
    };

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.logoImage}
                    source={require('../../assets/images/png/moonlet_space.png')}
                />
                <Text style={styles.launchingSoonText}>{translate('Rewards.launchingSoon')}</Text>

                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={this.getCurrentToken}>
                        <Text>Copy fb token</Text>
                    </Button>
                    <Button style={styles.button} onPress={this.getApnsToken}>
                        <Text>Copy ios token</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

export const WatchScreen = smartConnect(WatchScreenComponent, [withTheme(stylesProvider)]);
