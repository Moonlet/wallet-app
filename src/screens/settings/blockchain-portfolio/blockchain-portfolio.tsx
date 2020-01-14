import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { Text } from '../../../library';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../core/i18n';
import { IBlockchainsOptions } from '../../../redux/app/state';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { toogleBlockchainActive, updateBlockchainOrder } from '../../../redux/app/actions';
import { Blockchain } from '../../../core/blockchain/types';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';

export interface IReduxProps {
    blockchains: [{ key: Blockchain; value: IBlockchainsOptions }];
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

const navigationOptions = () => ({
    title: translate('Settings.blockchainPortfolio')
});

export class BlockchainPortfolioComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public renderBlockchain(
        item: { key: Blockchain; value: IBlockchainsOptions },
        move: () => void,
        isActive: boolean
    ) {
        const { styles, theme } = this.props;

        return (
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
                    <Image
                        style={styles.iconContainer}
                        resizeMode="contain"
                        source={
                            getBlockchain(item.key).config.tokens[
                                getBlockchain(item.key).config.coin
                            ].logo
                        }
                    />
                    <Text style={styles.blockchainName}>{item.key}</Text>
                </View>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPressOut={() => this.props.toogleBlockchainActive(item.key)}
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
                <TouchableOpacity style={styles.iconContainer} onLongPress={move}>
                    <Icon size={18} name="navigation-menu" style={styles.menuIcon} />
                </TouchableOpacity>
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <DraggableFlatList
                    data={this.props.blockchains}
                    renderItem={({ item, drag, isActive }) =>
                        this.renderBlockchain(item, drag, isActive)
                    }
                    keyExtractor={(item: { key: Blockchain; value: IBlockchainsOptions }) =>
                        `${item.value.order}`
                    }
                    onDragEnd={({ data }) => {
                        this.props.updateBlockchainOrder(
                            Object.assign(
                                {},
                                ...data.map(
                                    (
                                        item: { key: Blockchain; value: IBlockchainsOptions },
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

export const BlockchainPortfolioScreen = smartConnect(BlockchainPortfolioComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
