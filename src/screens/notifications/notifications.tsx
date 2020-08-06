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
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { Blockchain } from '../../core/blockchain/types';
import { markSeenNotification, fetchNotifications } from '../../redux/notifications/actions';
import { NotificationType } from '../../core/messaging/types';
import {
    updateTransactionFromBlockchain,
    getWalletAndAccountNameByAddress
} from '../../redux/wallets/actions';
import { LoadingModal } from '../../components/loading-modal/loading-modal';
import { openTransactionRequest } from '../../redux/ui/transaction-request/actions';
import { updateDisplayedHint } from '../../redux/app/actions';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { SmartImage } from '../../library/image/smart-image';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { ITokenConfigState } from '../../redux/tokens/state';
import moment from 'moment';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';

export interface IReduxProps {
    notifications: INotificationState;
    markSeenNotification: typeof markSeenNotification;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
    openTransactionRequest: typeof openTransactionRequest;
    fetchNotifications: (page?: number) => Promise<any>;
    updateDisplayedHint: typeof updateDisplayedHint;

    getWalletAndAccountNameByAddress: (
        address: string
    ) => { walletName: string; accountName: string };
}

const mapStateToProps = (state: IReduxState) => {
    return {
        notifications: state.notifications.notifications
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
    updateDisplayedHint,
    getWalletAndAccountNameByAddress
};

interface IState {
    notifications: INotificationType[];
    showLoading: boolean;
    page: number;
    isRefreshing: boolean;
}

export class NotificationsComponent extends React.Component<
    IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            notifications: [],
            showLoading: false,
            page: 1,
            isRefreshing: false
        };
    }

    public async componentDidMount() {
        await LoadingModal.open();

        // drop loading in 2.5 seconds if api call takes too long or crashes
        setTimeout(async () => LoadingModal.close(), 2500);

        await this.fetchNotifications();
        await LoadingModal.close();
    }

    private async handleNotificationTap(notification: INotificationType, notificationId: string) {
        await LoadingModal.open();

        // drop loading in 2.5 seconds if api call takes too long or crashes
        setTimeout(async () => LoadingModal.close(), 2500);

        switch (notification.data.action) {
            case NotificationType.TRANSACTION:
                this.props.updateTransactionFromBlockchain(
                    notification.data.transactionHash,
                    notification.data.blockchain as Blockchain,
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

        this.setState({
            notifications: this.state.notifications.map(notif =>
                notif.id === notificationId
                    ? {
                          ...notif,
                          seen: true
                      }
                    : notif
            )
        });

        this.props.markSeenNotification(notificationId);
    }

    private renderRow(notification: INotificationType, index: number) {
        const { styles } = this.props;

        const blockchain = notification.data.blockchain as Blockchain;
        let tokenConfig: ITokenConfigState;
        if (notification.data?.tokenSymbol) {
            tokenConfig = getTokenConfig(blockchain, notification.data.tokenSymbol);
        }
        const blockchainConfig = getBlockchain(blockchain).config;
        const BlockchainIcon = blockchainConfig.iconComponent;

        const walletAccountName = this.props.getWalletAndAccountNameByAddress(
            notification.data.address
        );

        return (
            // Swipeable - maybe delete notification?
            <TouchableHighlight
                key={`notification-${index}`}
                underlayColor={this.props.theme.colors.appBackground}
                onPress={() => this.handleNotificationTap(notification, notification.id)}
                style={{ opacity: notification.seen ? 0.5 : 1 }}
            >
                <View style={styles.rowContainer}>
                    <View style={styles.rowTextContainer}>
                        <View style={{ flexDirection: 'row', marginBottom: BASE_DIMENSION / 2 }}>
                            <SmartImage
                                style={styles.notifIcon}
                                source={tokenConfig?.icon || { iconComponent: BlockchainIcon }}
                            />

                            <Text style={styles.title}>{notification.title}</Text>
                        </View>

                        <Text style={styles.subtitle}>{notification.body}</Text>

                        {walletAccountName && (
                            <Text style={styles.subtitle}>
                                {`on ${walletAccountName.walletName}, ${walletAccountName.accountName}`}
                            </Text>
                        )}

                        {/* Used only for DEV_TOOLS in order to easier test that the pagination works properly*/}
                        {isFeatureActive(RemoteFeature.DEV_TOOLS) && (
                            <Text style={styles.subtitle}>
                                {moment(new Date(notification.createdAt)).format('llll')}
                            </Text>
                        )}
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

    private parseNotifications(notifications: any): INotificationType[] {
        const parsedNotifs: any = Object.values(notifications).reduce(
            (out: any, notification: any) => {
                out.push({
                    ...notification,
                    id: notification._id
                });
                return out;
            },
            []
        );

        return (this.state.isRefreshing ? [] : this.state.notifications).concat(parsedNotifs);
    }

    private async fetchNotifications() {
        const { page } = this.state;

        // drop loading indicator in 2.5 seconds if api call takes too long or crashes
        setTimeout(async () => this.setState({ showLoading: false }), 2500);

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

        this.setState({ isRefreshing: false });
    }

    public render() {
        const { styles } = this.props;
        const { notifications } = this.state;

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
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onRefresh()}
                            tintColor={this.props.theme.colors.accent}
                        />
                    }
                >
                    {notifications.length !== 0 ? (
                        notifications.map((notification: INotificationType, index: number) =>
                            this.renderRow(notification, index)
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

                    {notifications &&
                        Object.keys(notifications).length !== 0 &&
                        this.state.showLoading && (
                            <View style={styles.loadingContainer}>
                                <LoadingIndicator />
                            </View>
                        )}
                </ScrollView>
            </View>
        );
    }
}

export const NotificationsScreen = smartConnect(NotificationsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
