import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { Text } from '../../library';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon/icon';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../core/i18n';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { normalize } from '../../styles/dimensions';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { IAccountState, IWalletState, ITokenState } from '../../redux/wallets/state';
import { Amount } from '../../components/amount/amount';
import {
    toggleTokenActive,
    updateTokenOrder,
    removeTokenFromAccount
} from '../../redux/wallets/actions';
import { SmartImage } from '../../library/image/smart-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { DISPLAY_HINTS_TIMES } from '../../core/constants/app';
import { updateDisplayedHint } from '../../redux/app/actions';
import { IHints, HintsScreen, HintsComponent } from '../../redux/app/state';
import { ChainIdType } from '../../core/blockchain/types';
import { getChainId } from '../../redux/preferences/selectors';
import { IconValues } from '../../components/icon/values';

export interface IReduxProps {
    toggleTokenActive: typeof toggleTokenActive;
    updateTokenOrder: typeof updateTokenOrder;
    removeTokenFromAccount: typeof removeTokenFromAccount;

    tokens: [{ key: string; value: ITokenState }];
    wallet: IWalletState;
    selectedAccount: IAccountState;
    chainId: ChainIdType;
    hints: IHints;
    updateDisplayedHint: typeof updateDisplayedHint;
}

const mapDispatchToProps = {
    toggleTokenActive,
    updateTokenOrder,
    removeTokenFromAccount,
    updateDisplayedHint
};

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);
    const chainId = getChainId(state, selectedAccount.blockchain);

    return {
        tokens: Object.keys(selectedAccount.tokens[chainId])
            .map(key => ({
                key,
                value: selectedAccount.tokens[chainId][key]
            }))
            .sort((a, b) => a.value.order - b.value.order),
        selectedAccount,
        wallet: getSelectedWallet(state),
        hints: state.app.hints,
        chainId
    };
};

export const navigationOptions = ({ navigation, theme }: any) => ({
    title: translate('Account.manageAccounts')
});

export class ManageAccountComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;
    public accountsSwipeableRef: ReadonlyArray<string> = [];
    public currentlyOpenSwipeable: string = null;

    public componentDidMount() {
        this.props.navigation.setParams({ blockchain: this.props.selectedAccount.blockchain });
        setTimeout(() => this.showHints(), 500);
    }

    private showHints() {
        const tokens = Object.keys(this.props.selectedAccount.tokens);
        if (
            tokens &&
            tokens[1] &&
            this.props.hints.MANAGE_ACCOUNT.TOKENS_LIST < DISPLAY_HINTS_TIMES
        ) {
            const id = tokens[1];

            this.onSwipeableWillOpen(id);
            this.accountsSwipeableRef[id] && this.accountsSwipeableRef[id].openLeft();
            this.props.updateDisplayedHint(HintsScreen.MANAGE_ACCOUNT, HintsComponent.TOKENS_LIST);

            setTimeout(() => this.closeCurrentOpenedSwipable(), 1000);
        }
    }

    public closeCurrentOpenedSwipable() {
        this.accountsSwipeableRef[this.currentlyOpenSwipeable] &&
            this.accountsSwipeableRef[this.currentlyOpenSwipeable].close();
    }

    public renderLeftActions(token: ITokenState) {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    testID={`delete-${token.symbol.toLocaleLowerCase()}`}
                    style={styles.action}
                    onPress={() => {
                        this.props.removeTokenFromAccount(
                            this.props.selectedAccount,
                            token,
                            this.props.chainId
                        );
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon
                        name={IconValues.BIN}
                        size={normalize(32)}
                        style={styles.iconActionNegative}
                    />
                    <Text style={styles.textActionNegative}>{translate('Token.deleteToken')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
        item: { key: string; value: ITokenState },
        drag: () => void,
        isActive: boolean
    ) {
        const { styles, theme } = this.props;
        const blockchain = this.props.selectedAccount.blockchain;
        const index = item.value.symbol;

        const tokenConfig = getTokenConfig(blockchain, item.value.symbol);

        return (
            <Swipeable
                key={index}
                ref={ref => (this.accountsSwipeableRef[index] = ref)}
                renderLeftActions={() =>
                    tokenConfig.removable === true && this.renderLeftActions(item.value)
                }
                onSwipeableWillOpen={() => this.onSwipeableWillOpen(index)}
            >
                <View
                    testID={item.value.symbol}
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
                        <SmartImage source={tokenConfig.icon} />
                        <View style={styles.amountContainer}>
                            <Amount
                                style={styles.firstAmount}
                                amount={item.value.balance?.value.toString()}
                                token={item.value.symbol}
                                tokenDecimals={tokenConfig.decimals}
                                blockchain={blockchain}
                            />
                            <Amount
                                style={styles.secondAmount}
                                amount={item.value.balance?.value.toString()}
                                token={item.value.symbol}
                                tokenDecimals={tokenConfig.decimals}
                                blockchain={blockchain}
                                convert
                            />
                        </View>
                    </View>
                    {tokenConfig.removable === true && (
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPressOut={() => {
                                this.props.toggleTokenActive(
                                    this.props.selectedAccount,
                                    item.value,
                                    this.props.chainId
                                );
                            }}
                        >
                            <Icon
                                size={normalize(18)}
                                name={
                                    item.value.active
                                        ? IconValues.CHECK_BOX_THICKED
                                        : IconValues.CHECK_BOX
                                }
                                style={[
                                    {
                                        color: item.value.active
                                            ? theme.colors.accent
                                            : theme.colors.textSecondary
                                    }
                                ]}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.iconContainer} onLongPress={drag}>
                        <Icon
                            size={normalize(18)}
                            name={IconValues.NAVIGATION_MENU}
                            style={styles.menuIcon}
                        />
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
                    keyExtractor={(item: { key: string; value: ITokenState }) =>
                        `token-${
                            getTokenConfig(this.props.selectedAccount.blockchain, item.value.symbol)
                                .name
                        }`
                    }
                    onDragEnd={({ data }) => {
                        this.props.updateTokenOrder(
                            this.props.selectedAccount,
                            Object.assign(
                                {},
                                ...data.map(
                                    (item: { key: string; value: ITokenState }, index: number) => ({
                                        [item.key]: { ...item.value, order: index }
                                    })
                                )
                            ),
                            this.props.chainId
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
