import React from 'react';
import { View, TouchableHighlight, ScrollView, Image, RefreshControl } from 'react-native';
import { Text } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { INavigationProps } from '../../navigation/with-navigation-params';
import Icon from '../../components/icon/icon';
import { IconValues } from '../../components/icon/values';
import { normalize, BASE_DIMENSION } from '../../styles/dimensions';
import { INotificationType, INotificationState } from '../../redux/notifications/state';
import { BottomBlockchainNavigation } from '../../components/bottom-blockchain-navigation/bottom-blockchain-navigation';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { Blockchain } from '../../core/blockchain/types';
import { getSelectedBlockchain, getSelectedWallet } from '../../redux/wallets/selectors';
import { markSeenNotification, fetchNotifications } from '../../redux/notifications/actions';
import { NotificationType } from '../../core/messaging/types';
import { updateTransactionFromBlockchain } from '../../redux/wallets/actions';
import { LoadingModal } from '../../components/loading-modal/loading-modal';
import { openTransactionRequest } from '../../redux/ui/transaction-request/actions';
import { DISPLAY_HINTS_TIMES } from '../../core/constants/app';
import { HintsScreen, HintsComponent, IHints } from '../../redux/app/state';
import { updateDisplayedHint } from '../../redux/app/actions';

export interface IReduxProps {
    walletId: string;
    notifications: INotificationState;
    selectedBlockchain: Blockchain;
    markSeenNotification: (notificationId: string, blockchain?: string) => Promise<any>;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
    openTransactionRequest: typeof openTransactionRequest;
    fetchNotifications: (page?: number) => Promise<any>;
    hints: IHints;
    updateDisplayedHint: typeof updateDisplayedHint;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        walletId: getSelectedWallet(state)?.id,
        notifications: state.notifications.notifications,
        selectedBlockchain: getSelectedBlockchain(state),
        hints: state.app.hints
    };
};

export const navigationOptions = () => ({
    title: translate('App.labels.notifications')
});

const mapDispatchToProps = {
    markSeenNotification,
    updateTransactionFromBlockchain,
    openTransactionRequest,
    fetchNotifications,
    updateDisplayedHint
};

interface IState {
    notifications: INotificationState;
    showLoading: boolean;
    page: number;
    hideBottomNav: boolean;
    isRefreshing: boolean;
}

export class NotificationsComponent extends React.Component<
    IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    private scrollOffset: number = 0;

    constructor(
        props: IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            notifications: undefined,
            showLoading: false,
            page: 1,
            hideBottomNav: false,
            isRefreshing: false
        };
    }

    public async componentDidMount() {
        await this.fetchNotifications();

        if (
            this.state.notifications &&
            Object.keys(this.state.notifications).length > 0 &&
            this.props.hints.WALLETS_SCREEN.WALLETS_LIST < DISPLAY_HINTS_TIMES
        ) {
            this.props.updateDisplayedHint(HintsScreen.WALLETS_SCREEN, HintsComponent.WALLETS_LIST);

            this.setState({ isRefreshing: true }, () => {
                setTimeout(() => this.setState({ isRefreshing: false }), 1000);
            });
        }
    }

    private async handleNotificationTap(notification: INotificationType, notificationId: string) {
        const blockchain = notification.data.blockchain as Blockchain;

        await LoadingModal.open();

        switch (notification.data.action) {
            case NotificationType.TRANSACTION:
                this.props.updateTransactionFromBlockchain(
                    notification.data.transactionHash,
                    blockchain,
                    Number(notification.data.chainId), // TODO: maybe String is needed
                    Number(notification.data.broadcastedOnBlock),
                    true
                );
                break;

            case NotificationType.EXTENSION_SIGN_TX:
                this.props.openTransactionRequest({
                    requestId: notification.data.requestId
                });
                await LoadingModal.close();
                break;

            default:
                await LoadingModal.close();
                break;
        }

        try {
            const res = await this.props.markSeenNotification(notificationId, blockchain);
            if (res) {
                const { notifications } = this.state;
                notifications[blockchain][notificationId].seen = true;
                this.setState({ notifications });
            }
        } catch {
            // already handled this in redux actions
        }
    }

    private renderRow(notification: INotificationType, notificationId: string, index: number) {
        const { styles } = this.props;

        return (
            // Swipeable - maybe delete notification?
            <TouchableHighlight
                key={`notification-${index}`}
                underlayColor={this.props.theme.colors.appBackground}
                onPress={() => this.handleNotificationTap(notification, notificationId)}
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

    private parseNotifications(notifications: any): INotificationState {
        const finalNotifications: INotificationState = this.state.notifications
            ? this.state.notifications
            : {};

        for (const notif of notifications) {
            const notifData = {
                walletId: notif.walletId,
                title: notif.title,
                body: notif.body,
                seen: notif.seen,
                data: notif.data
            };

            Object.assign(finalNotifications, {
                ...finalNotifications,
                [notif.data.blockchain]: {
                    ...(finalNotifications && finalNotifications[notif.data.blockchain]),
                    [notif._id]: notifData
                }
            });
        }

        return finalNotifications;
    }

    private async fetchNotifications() {
        const { page } = this.state;

        try {
            // Fetch next page
            const notifications: any = await this.props.fetchNotifications(page);

            if (notifications && notifications.length > 0) {
                const finalNotifications = this.parseNotifications(notifications);

                this.setState({
                    notifications: finalNotifications,
                    page: page + 1
                });
            }
        } catch {
            // already handled this in redux actions
        }

        this.setState({ showLoading: false });
    }

    private isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
        const paddingToBottom = BASE_DIMENSION * 2;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    private async onRefresh() {
        this.setState({ isRefreshing: true });

        const notifications = await this.props.fetchNotifications();
        if (notifications) {
            const finalNotifications = this.parseNotifications(notifications);
            this.setState({ notifications: finalNotifications });
        }
    }

    public render() {
        const { styles } = this.props;
        const { notifications } = this.state;

        let notifsBySelectedBlockchain;
        notifications &&
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
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                            if (!this.state.showLoading) {
                                this.setState({ showLoading: true }, async () => {
                                    await this.fetchNotifications();
                                });
                            }
                        }
                    }}
                    onScroll={(event: any) => {
                        const currentOffset = event.nativeEvent.contentOffset.y;
                        currentOffset >= this.scrollOffset
                            ? this.setState({ hideBottomNav: true }) // scroll down
                            : this.setState({ hideBottomNav: false }); // scroll up
                        this.scrollOffset = currentOffset;

                        if (currentOffset === 0) {
                            this.setState({ hideBottomNav: false }); // scroll on top
                        }
                    }}
                    // scrollEventThrottle={16} // TODO: this should be set - find the best value
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onRefresh()}
                            tintColor={this.props.theme.colors.accent}
                        />
                    }
                >
                    {notifsBySelectedBlockchain ? (
                        Object.keys(
                            notifsBySelectedBlockchain
                        ).map((notificationId: string, index: number) =>
                            this.renderRow(
                                notifsBySelectedBlockchain[notificationId],
                                notificationId,
                                index
                            )
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
                    {/* TODO: this needs improvements because on pullToRefresh this is also called */}
                    {/* {this.state.showLoading && (
                        <View style={styles.loadingContainer}>
                            <LoadingIndicator />
                        </View>
                    )} */}
                </ScrollView>

                {!this.state.hideBottomNav && (
                    <BottomBlockchainNavigation
                        style={{ paddingBottom: BASE_DIMENSION + BASE_DIMENSION / 2 }}
                    />
                )}
            </View>
        );
    }
}

export const NotificationsScreen = smartConnect(NotificationsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
