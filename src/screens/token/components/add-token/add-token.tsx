import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { translate } from '../../../../core/i18n';
import { Button, Text } from '../../../../library';
import { NavigationService } from '../../../../navigation/navigation-service';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { connect } from 'react-redux';
import { Blockchain, ChainIdType } from '../../../../core/blockchain/types';
import { IReduxState } from '../../../../redux/state';
import { getSelectedBlockchain, getSelectedAccount } from '../../../../redux/wallets/selectors';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { getChainId } from '../../../../redux/preferences/selectors';
import { DraggableCardWithCheckbox } from '../../../../components/draggable-card-with-check-box/draggable-card-with-check-box';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { Amount } from '../../../../components/amount/amount';
import {
    toggleTokenActive,
    removeTokenFromAccount,
    updateTokenOrder
} from '../../../../redux/wallets/actions';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from '../../../../components/icon/icon';
import { IconValues } from '../../../../components/icon/values';
import DraggableFlatList from 'react-native-draggable-flatlist';

interface IReduxProps {
    tokens: [{ key: string; value: ITokenState }];
    account: IAccountState;
    blockchain: Blockchain;
    chainId: ChainIdType;
    toggleTokenActive: typeof toggleTokenActive;
    removeTokenFromAccount: typeof removeTokenFromAccount;
    updateTokenOrder: typeof updateTokenOrder;
}

const mapStateToProps = (state: IReduxState) => {
    const blockchain = getSelectedBlockchain(state);
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, blockchain);

    return {
        blockchain,
        account,
        chainId,
        tokens: Object.keys(account.tokens[chainId])
            .map(key => ({
                key,
                value: account.tokens[chainId][key]
            }))
            .sort((a, b) => a.value.order - b.value.order)
    };
};

const mapDispatchToProps = {
    toggleTokenActive,
    removeTokenFromAccount,
    updateTokenOrder
};

export const navigationOptions = () => ({
    title: translate('App.labels.addToken')
});

export class AddTokenScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public tokensSwipeableRef: ReadonlyArray<string> = [];
    public currentlyOpenSwipeable: string = null;

    private closeCurrentOpenedSwipable() {
        this.tokensSwipeableRef[this.currentlyOpenSwipeable] &&
            this.tokensSwipeableRef[this.currentlyOpenSwipeable].close();
    }

    private onSwipeableWillOpen(index: string) {
        if (
            index !== this.currentlyOpenSwipeable &&
            this.tokensSwipeableRef[this.currentlyOpenSwipeable]
        ) {
            this.closeCurrentOpenedSwipable();
        }

        this.currentlyOpenSwipeable = index;
    }

    private renderLeftActions(token: ITokenState) {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    testID={`delete-${token.symbol.toLocaleLowerCase()}`}
                    style={styles.action}
                    onPress={() => {
                        this.props.removeTokenFromAccount(
                            this.props.account,
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

    public renderToken(
        item: { key: string; value: ITokenState },
        drag: () => void,
        isActive: boolean
    ) {
        const { styles } = this.props;

        const token = item.value;
        const tokenConfig = getTokenConfig(this.props.account.blockchain, token.symbol);

        const index = token.symbol;

        return (
            <Swipeable
                key={index}
                ref={ref => (this.tokensSwipeableRef[index] = ref)}
                renderLeftActions={() =>
                    tokenConfig.removable === true && this.renderLeftActions(token)
                }
                onSwipeableWillOpen={() => this.onSwipeableWillOpen(index)}
            >
                <DraggableCardWithCheckbox
                    key={`token-${index}`}
                    mainText={
                        <Amount
                            style={styles.amountText}
                            token={token.symbol}
                            tokenDecimals={tokenConfig.decimals}
                            amount={token.balance?.value}
                            blockchain={this.props.blockchain}
                        />
                    }
                    subtitleText={
                        <Amount
                            style={styles.amountConvertedText}
                            token={token.symbol}
                            tokenDecimals={tokenConfig.decimals}
                            amount={token.balance?.value}
                            blockchain={this.props.blockchain}
                            convert
                        />
                    }
                    isActive={token.active}
                    checkBox={{
                        visible: tokenConfig.removable,
                        onPress: () =>
                            this.props.toggleTokenActive(
                                this.props.account,
                                token,
                                this.props.chainId
                            )
                    }}
                    draggable={{
                        visible: true,
                        onPress: drag,
                        isDragging: isActive
                    }}
                    imageIcon={tokenConfig.icon}
                />
            </Swipeable>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <DraggableFlatList
                        data={this.props.tokens}
                        renderItem={({ item, drag, isActive }) =>
                            this.renderToken(item, drag, isActive)
                        }
                        keyExtractor={(item: { key: string; value: ITokenState }) =>
                            `token-${
                                getTokenConfig(this.props.account.blockchain, item.value.symbol)
                                    .name
                            }`
                        }
                        onDragEnd={({ data }) => {
                            this.props.updateTokenOrder(
                                this.props.account,
                                Object.assign(
                                    {},
                                    ...data.map(
                                        (
                                            item: { key: string; value: ITokenState },
                                            index: number
                                        ) => ({
                                            [item.key]: { ...item.value, order: index }
                                        })
                                    )
                                ),
                                this.props.chainId
                            );
                        }}
                    />
                </View>
                <Button
                    primary
                    onPress={() => NavigationService.navigate('ManageToken', {})}
                    wrapperStyle={{ marginHorizontal: BASE_DIMENSION * 2 }}
                    disabled={!getBlockchain(this.props.blockchain).config.ui.enableTokenManagement}
                >
                    {translate('App.labels.addToken')}
                </Button>
            </View>
        );
    }
}

export const AddTokenScreen = smartConnect(AddTokenScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
