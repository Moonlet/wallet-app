import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
import { themes } from '../../../navigation/navigation';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { toogleBlockchainActive, updateBlockchainOrder } from '../../../redux/app/actions';

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

const navigationOptions = ({ theme }: any) => ({
    title: translate('Settings.blockchainPortfolio'),
    headerStyle: {
        backgroundColor: themes[theme].colors.header
    }
});

export class BlockchainPortfolioComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public renderBlockchain = ({ item, index, move, moveEnd, isActive }: any) => {
        const { styles, theme } = this.props;

        return (
            <View>
                <View style={styles.rowContainer}>
                    <Text style={styles.blockchainName}>{item.key}</Text>
                    <TouchableOpacity onPress={() => this.props.toogleBlockchainActive(item.key)}>
                        <Icon
                            size={18}
                            name={item.value.active ? 'check-2-thicked' : 'check-2'}
                            style={[
                                styles.checkIcon,
                                {
                                    color: item.value.active
                                        ? theme.colors.accent
                                        : theme.colors.textSecondary
                                }
                            ]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={move} onPressOut={moveEnd}>
                        <Icon size={18} name="navigation-menu" style={styles.menuIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.divider} />
            </View>
        );
    };

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <DraggableFlatList
                    data={this.props.blockchains}
                    renderItem={this.renderBlockchain}
                    keyExtractor={(item: any) => `${item.value.order}`}
                    scrollPercent={5}
                    onMoveEnd={({ data }) => {
                        this.props.updateBlockchainOrder(
                            Object.assign(
                                {},
                                ...data.map((item, index) => ({
                                    [item.key]: { ...item.value, order: index }
                                }))
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
