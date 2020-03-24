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
import { IBlockchainOptions } from '../../../redux/preferences/state';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { setBlockchainActive, setBlockchainOrder } from '../../../redux/preferences/actions';
import { Blockchain } from '../../../core/blockchain/types';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import {
    getBlockchainsPortfolio,
    hasNetwork,
    getNrActiveBlockchains
} from '../../../redux/preferences/selectors';
import { Dialog } from '../../../components/dialog/dialog';
import { BASE_DIMENSION, normalize } from '../../../styles/dimensions';
import { SmartImage } from '../../../library/image/smart-image';

export interface IReduxProps {
    blockchains: [{ key: Blockchain; value: IBlockchainOptions }];
    setBlockchainActive: typeof setBlockchainActive;
    setBlockchainOrder: typeof setBlockchainOrder;
    testNet: boolean;
    nrActiveBlockchains: number;
}

const mapDispatchToProps = {
    setBlockchainActive,
    setBlockchainOrder
};

const mapStateToProps = (state: IReduxState) => {
    return {
        testNet: state.preferences.testNet,
        blockchains: getBlockchainsPortfolio(state),
        nrActiveBlockchains: getNrActiveBlockchains(state)
    };
};

const navigationOptions = () => ({
    title: translate('Settings.blockchainPortfolio')
});

export class BlockchainPortfolioComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
    }

    public renderBlockchain(
        item: { key: Blockchain; value: IBlockchainOptions },
        move: () => void,
        isActive: boolean
    ) {
        const { styles, theme } = this.props;

        const networkAvailable = hasNetwork(item.key, this.props.testNet);

        const BlockchainIcon = getBlockchain(item.key).config.iconComponent;

        return (
            <View
                style={[
                    styles.rowContainer,
                    {
                        borderColor:
                            item.value.active && networkAvailable
                                ? theme.colors.accentSecondary
                                : theme.colors.cardBackground,
                        backgroundColor: isActive
                            ? theme.colors.appBackground
                            : theme.colors.cardBackground
                    }
                ]}
            >
                <View style={styles.infoContainer}>
                    <SmartImage
                        source={{ iconComponent: BlockchainIcon }}
                        style={{ marginHorizontal: BASE_DIMENSION }}
                    />
                    <Text style={styles.blockchainName}>{item.key}</Text>
                </View>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPressOut={() => {
                        if (!networkAvailable) {
                            Dialog.info(translate('Settings.blockchainHasNoNetwork'), '');
                        } else {
                            if (
                                item.value.active === true &&
                                this.props.nrActiveBlockchains === 1
                            ) {
                                Dialog.info(
                                    translate('Settings.cannotDeactivateAllBlockchains'),
                                    ''
                                );
                            } else this.props.setBlockchainActive(item.key, !item.value.active);
                        }
                    }}
                >
                    <Icon
                        size={normalize(18)}
                        name={item.value.active && networkAvailable ? 'check-2-thicked' : 'check-2'}
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
                    <Icon size={normalize(18)} name="navigation-menu" style={styles.menuIcon} />
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
                    keyExtractor={(item: { key: Blockchain; value: IBlockchainOptions }) =>
                        `${item.value.order}`
                    }
                    onDragEnd={({ data }) => {
                        this.props.setBlockchainOrder(
                            Object.assign(
                                {},
                                ...data.map(
                                    (
                                        item: {
                                            key: Blockchain;
                                            value: IBlockchainOptions;
                                        },
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
