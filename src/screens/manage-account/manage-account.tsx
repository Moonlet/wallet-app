import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { Text, Swipeable } from '../../library';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../core/i18n';
import { IBlockchainsOptions } from '../../redux/app/state';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { toogleBlockchainActive, updateBlockchainOrder } from '../../redux/app/actions';
import { Blockchain } from '../../core/blockchain/types';
import { ICON_SIZE, BASE_DIMENSION } from '../../styles/dimensions';
import { themes } from '../../navigation/navigation';

export interface IReduxProps {
    blockchains: IBlockchainsOptions;
    toogleBlockchainActive: typeof toogleBlockchainActive;
    updateBlockchainOrder: typeof updateBlockchainOrder;
}

const mapDispatchToProps = {
    toogleBlockchainActive,
    updateBlockchainOrder
};

const mapStateToProps = (state: IReduxState) => {
    return {
        blockchains: Object.keys(state.app.blockchains)
            .map(key => ({ key, value: state.app.blockchains[key] }))
            .sort((a, b) => a.value.order - b.value.order)
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

    public renderLeftActions = (account: Blockchain) => {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        // this.props.deleteContact(contact.blockchain, contact.address);
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon name="bin" size={32} style={styles.iconActionNegative} />
                    <Text style={styles.textActionNegative}>{translate('Token.deleteToken')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        // this.onPressUpdate(contact);
                        this.props.navigation.navigate('ManageToken', {
                            token: { address: '0x67', symbol: 'DAI', decimals: '18' }
                        });
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon name="pencil" size={28} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>{translate('Token.editToken')}</Text>
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

    public renderAccount(
        item: { key: Blockchain; value: IBlockchainsOptions },
        move: any,
        moveEnd: any
    ) {
        const { styles, theme } = this.props;
        const index = item.key;

        return (
            <Swipeable
                key={index}
                ref={ref => (this.accountsSwipeableRef[index] = ref)}
                renderLeftActions={() => this.renderLeftActions(item.key)}
                onSwipeableWillOpen={() => this.onSwipeableWillOpen(index)}
            >
                <View
                    style={[
                        styles.rowContainer,
                        {
                            borderColor: item.value.active
                                ? theme.colors.accentSecondary
                                : theme.colors.cardBackground
                        }
                    ]}
                >
                    <View style={styles.infoContainer}>
                        <Icon name="money-wallet-1" size={ICON_SIZE} style={styles.accountIcon} />
                        <View>
                            <Text style={styles.firstAmount}>500.00 DAI</Text>
                            <Text style={styles.secondAmount}>$14.500</Text>
                        </View>
                        {/* <Text style={styles.blockchainName}>{item.key}</Text> */}
                    </View>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => this.props.toogleBlockchainActive(item.key)}
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
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onLongPress={move}
                        onPressOut={moveEnd}
                    >
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
                    data={this.props.blockchains}
                    renderItem={({ item, move, moveEnd }) =>
                        this.renderAccount(item, move, moveEnd)
                    }
                    keyExtractor={(item: { key: Blockchain; value: IBlockchainsOptions }) =>
                        `${item.value.order}`
                    }
                    scrollPercent={5}
                    onMoveEnd={({ data }) => {
                        // this.props.updateBlockchainOrder(
                        //     Object.assign(
                        //         {},
                        //         ...data.map(
                        //             (
                        //                 item: { key: Blockchain; value: IBlockchainsOptions },
                        //                 index: number
                        //             ) => ({
                        //                 [item.key]: { ...item.value, order: index }
                        //             })
                        //         )
                        //     )
                        // );
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
