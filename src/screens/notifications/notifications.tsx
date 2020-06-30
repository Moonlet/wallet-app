import React from 'react';
import { View, TouchableHighlight, ScrollView, Image } from 'react-native';
import { Text } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { INavigationProps } from '../../navigation/with-navigation-params';
import Icon from '../../components/icon/icon';
import { IconValues } from '../../components/icon/values';
import { normalize, BASE_DIMENSION } from '../../styles/dimensions';
import { INotificationType, INotificationsState } from '../../redux/notifications/state';
import { BottomBlockchainNavigation } from '../../components/bottom-blockchain-navigation/bottom-blockchain-navigation';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { Blockchain } from '../../core/blockchain/types';
import { getSelectedBlockchain } from '../../redux/wallets/selectors';

export interface IReduxProps {
    notifications: INotificationsState;
    selectedBlockchain: Blockchain;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        notifications: state.notifications,
        selectedBlockchain: getSelectedBlockchain(state)
    };
};

export const navigationOptions = () => ({
    title: translate('App.labels.notifications')
});

export class NotificationsComponent extends React.Component<
    IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    private renderRow(notification: INotificationType, index: number) {
        const { styles } = this.props;

        return (
            // Swipeable - maybe delete notification?
            <TouchableHighlight
                key={`notification-${index}`}
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
        const { styles, notifications } = this.props;

        let notifsBySelectedBlockchain;
        Object.keys(notifications).filter((blockchain: Blockchain) => {
            if (blockchain === this.props.selectedBlockchain) {
                notifsBySelectedBlockchain = notifications[blockchain];
            }
        });

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {notifsBySelectedBlockchain ? (
                        Object.values(
                            notifsBySelectedBlockchain
                        ).map((notif: INotificationType, index: number) =>
                            this.renderRow(notif, index)
                        )
                    ) : (
                        // Empty State
                        <View style={styles.emptyContainer}>
                            <Image
                                style={styles.logoImage}
                                source={require('../../assets/images/png/moonlet_space_gray.png')}
                            />
                            <Text style={styles.emptyNotifTitle}>
                                {translate('Notifications.notificationsCenter.emptyNotifTitle')}
                            </Text>
                            <Text style={styles.emptyNotifSubtitle}>
                                {translate('Notifications.notificationsCenter.emptyNotifSubtitle')}
                            </Text>
                        </View>
                    )}
                </ScrollView>

                <BottomBlockchainNavigation
                    style={{ paddingBottom: BASE_DIMENSION + BASE_DIMENSION / 2 }}
                />
            </View>
        );
    }
}

export const NotificationsScreen = smartConnect(NotificationsComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
