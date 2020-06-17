import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Text } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { INavigationProps } from '../../navigation/with-navigation-params';
import Icon from '../../components/icon/icon';
import { IconValues } from '../../components/icon/values';
import { normalize } from '../../styles/dimensions';

interface INotificationType {
    title: string;
    subtitle: string;
    // cta: any;
    read: boolean;
}

export const navigationOptions = () => ({
    title: translate('App.labels.notifications')
});

export class NotificationsComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    private renderRow(notification: INotificationType) {
        const { styles } = this.props;

        return (
            <TouchableHighlight
                underlayColor={this.props.theme.colors.appBackground}
                onPress={() => {
                    // TODO
                }}
            >
                <View style={styles.rowContainer}>
                    <View style={styles.rowTextContainer}>
                        <Text style={notification.read ? styles.titleRead : styles.titleUnread}>
                            {notification.title}
                        </Text>
                        <Text
                            style={notification.read ? styles.subtitleRead : styles.subtitleUnread}
                        >
                            {notification.subtitle}
                        </Text>
                    </View>
                    <Icon
                        name={IconValues.CHEVRON_RIGHT}
                        size={normalize(16)}
                        style={styles.rightIcon}
                    />
                </View>
            </TouchableHighlight>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                {this.renderRow({
                    title: 'Claim your reward now',
                    subtitle: 'You have 500.00 ZIL available to be claimed',
                    read: false
                })}
                {this.renderRow({
                    title: 'Transaction failed',
                    subtitle:
                        '10.0000 ZIL failed to be sent to the following address: zil1f...lsd7t',
                    read: false
                })}
                {this.renderRow({
                    title: 'Transaction sent',
                    subtitle: '10.0000 ZIL sent to the following address: zil1f...lsd7t',
                    read: true
                })}
            </View>
        );
    }
}

export const NotificationsScreen = smartConnect(NotificationsComponent, [
    withTheme(stylesProvider)
]);
