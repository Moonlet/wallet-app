import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { Text, Swipeable } from '../../library';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../core/i18n';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { ICON_SIZE, BASE_DIMENSION } from '../../styles/dimensions';
import { themes } from '../../navigation/navigation';
import { getCurrentAccount, selectCurrentWallet } from '../../redux/wallets/selectors';
import { IAccountState, IWalletState, TokenType } from '../../redux/wallets/state';
import { Amount } from '../../components/amount/amount';
import { toggleTokenActive, updateTokenOrder, removeToken } from '../../redux/wallets/actions';
import { ITokenConfig } from '../../core/blockchain/types/token';

export interface IReduxProps {
    toggleTokenActive: typeof toggleTokenActive;
    updateTokenOrder: typeof updateTokenOrder;
    removeToken: typeof removeToken;

    tokens: [{ key: string; value: ITokenConfig }];
    wallet: IWalletState;
    selectedAccount: IAccountState;
}

const mapDispatchToProps = {
    toggleTokenActive,
    updateTokenOrder,
    removeToken
};

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getCurrentAccount(state);

    return {
        tokens: Object.keys(selectedAccount.tokens)
            .map(key => ({ key, value: selectedAccount.tokens[key] }))
            .sort((a, b) => a.value.order - b.value.order),
        selectedAccount,
        wallet: selectCurrentWallet(state)
    };
};

export const navigationOptions = ({ navigation, theme }: any) => ({
    title: translate('Account.manageAccount'),
    headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate('ManageToken')}>
            <Icon
                name="add"
                size={ICON_SIZE}
                style={{
                    color: themes[theme].colors.accent,
                    alignSelf: 'center',
                    marginRight: BASE_DIMENSION * 2
                }}
            />
        </TouchableOpacity>
    )
});

export class ManageAccountComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;
    public accountsSwipeableRef: ReadonlyArray<string> = new Array();
    public currentlyOpenSwipeable: string = null;

    public closeCurrentOpenedSwipable() {
        this.accountsSwipeableRef[this.currentlyOpenSwipeable] &&
            this.accountsSwipeableRef[this.currentlyOpenSwipeable].close();
    }

    public renderLeftActions = (token: ITokenConfig) => {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        this.props.removeToken(
                            this.props.wallet.id,
                            this.props.selectedAccount,
                            token
                        );
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon name="bin" size={32} style={styles.iconActionNegative} />
                    <Text style={styles.textActionNegative}>{translate('Token.deleteToken')}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    public onSwipeableWillOpen(index: string) {
        if (
            index !== this.currentlyOpenSwipeable &&
            this.accountsSwipeableRef[this.currentlyOpenSwipeable]
        ) {
            this.closeCurrentOpenedSwipable();
        }

        this.currentlyOpenSwipeable = index;
    }

    public renderToken(
        item: { key: string; value: ITokenConfig },
        drag: () => void,
        isActive: boolean
    ) {
        const { styles, theme } = this.props;
        const index = item.key;

        return (
            <Swipeable
                key={index}
                ref={ref => (this.accountsSwipeableRef[index] = ref)}
                renderLeftActions={() =>
                    item.value.type !== TokenType.NATIVE && this.renderLeftActions(item.value)
                }
                onSwipeableWillOpen={() => this.onSwipeableWillOpen(index)}
            >
                <View
                    style={[
                        styles.rowContainer,
                        {
                            borderColor: item.value.active
                                ? theme.colors.accentSecondary
                                : theme.colors.cardBackground,
                            backgroundColor: isActive
                                ? theme.colors.appBackground
                                : theme.colors.cardBackground
                        }
                    ]}
                >
                    <View style={styles.infoContainer}>
                        <View style={styles.iconContainer}>
                            <Image
                                style={styles.tokenLogo}
                                resizeMode="contain"
                                source={item.value.logo}
                            />
                        </View>
                        <View style={styles.amountContainer}>
                            <Amount
                                style={styles.firstAmount}
                                amount={item.value.balance?.value}
                                token={item.value.symbol}
                                tokenDecimals={item.value.decimals}
                                blockchain={this.props.selectedAccount.blockchain}
                            />
                            <Amount
                                style={styles.secondAmount}
                                amount={item.value.balance?.value}
                                token={item.value.symbol}
                                tokenDecimals={item.value.decimals}
                                blockchain={this.props.selectedAccount.blockchain}
                                convert
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPressOut={() =>
                            this.props.toggleTokenActive(
                                this.props.wallet.id,
                                this.props.selectedAccount,
                                item.value
                            )
                        }
                    >
                        <Icon
                            size={18}
                            name={item.value.active ? 'check-2-thicked' : 'check-2'}
                            style={[
                                {
                                    color: item.value.active
                                        ? theme.colors.accent
                                        : theme.colors.textSecondary
                                }
                            ]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onLongPress={drag}>
                        <Icon size={18} name="navigation-menu" style={styles.menuIcon} />
                    </TouchableOpacity>
                </View>
            </Swipeable>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <DraggableFlatList
                    data={this.props.tokens}
                    renderItem={({ item, drag, isActive }) =>
                        this.renderToken(item, drag, isActive)
                    }
                    keyExtractor={(item: { key: string; value: ITokenConfig }) =>
                        `${item.value.order}`
                    }
                    onDragEnd={({ data }) => {
                        this.props.updateTokenOrder(
                            this.props.wallet.id,
                            this.props.selectedAccount,
                            Object.assign(
                                {},
                                ...data.map(
                                    (
                                        item: { key: string; value: ITokenConfig },
                                        index: number
                                    ) => ({
                                        [item.key]: { ...item.value, order: index }
                                    })
                                )
                            )
                        );
                    }}
                />
            </View>
        );
    }
}

export const ManageAccountScreen = smartConnect(ManageAccountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
