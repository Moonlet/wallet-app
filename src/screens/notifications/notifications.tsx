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
import { getSelectedBlockchain, getSelectedWallet } from '../../redux/wallets/selectors';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { HttpClient } from '../../core/utils/http-client';
import CONFIG from '../../config';

export interface IReduxProps {
    walletId: string;
    notifications: INotificationsState;
    selectedBlockchain: Blockchain;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        walletId: getSelectedWallet(state)?.id,
        notifications: state.notifications.notifications,
        selectedBlockchain: getSelectedBlockchain(state)
    };
};

export const navigationOptions = () => ({
    title: translate('App.labels.notifications')
});

interface IState {
    notifications: INotificationsState;
    showLoading: boolean;
    page: number;
}

export class NotificationsComponent extends React.Component<
    IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    private scrollView: any;

    constructor(
        props: IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            notifications: props.notifications,
            showLoading: false,
            page: 1
        };
    }

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
                        <Text style={notification.seen ? styles.titleRead : styles.titleUnread}>
                            {notification.title}
                        </Text>
                        <Text
                            style={notification.seen ? styles.subtitleRead : styles.subtitleUnread}
                        >
                            {notification.body}
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

    private async fetchNotifications() {
        const { page, notifications } = this.state;

        try {
            this.scrollView.scrollToEnd({ animated: true });

            // Fetch next page
            const http = new HttpClient(
                CONFIG.notificationCenter.getNotificationsUrl + `/${page + 1}`
            );
            const res = await http.post('', {
                walletId: this.props.walletId
            });

            if (res?.result?.notifications && res.result.notifications.length > 0) {
                let finalNotifications = notifications;

                for (const notif of res.result.notifications) {
                    const notifData = {
                        walletId: notif.walletId,
                        title: notif.title,
                        body: notif.body,
                        seen: notif.seen,
                        data: notif.data
                    };

                    finalNotifications = {
                        ...finalNotifications,
                        [notif.data.blockchain]: {
                            ...finalNotifications[notif.data.blockchain],
                            [notif._id]: notifData
                        }
                    };
                }

                this.setState({
                    notifications: finalNotifications,
                    page: page + 1
                });
            }
        } catch {
            //
        }

        this.setState({ showLoading: false });
    }

    private isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
        const paddingToBottom = BASE_DIMENSION * 2;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    public render() {
        const { styles } = this.props;
        const { notifications } = this.state;

        let notifsBySelectedBlockchain;
        Object.keys(notifications).filter((blockchain: Blockchain) => {
            if (blockchain === this.props.selectedBlockchain) {
                notifsBySelectedBlockchain = notifications[blockchain];
            }
        });

        return (
            <View style={styles.container}>
                <ScrollView
                    ref={ref => (this.scrollView = ref)}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                            if (!this.state.showLoading) {
                                this.setState({ showLoading: true }, async () => {
                                    await this.fetchNotifications();
                                });
                            }
                        }
                    }}
                    // TODO: find a way to fix this / or user another solution
                    // onContentSizeChange={() => {
                    //     if (this.state.showLoading) {
                    //         this.scrollView.scrollToEnd({ animated: true });
                    //     }
                    // }}
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
                    {this.state.showLoading && (
                        <View style={styles.loadingContainer}>
                            <LoadingIndicator />
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
