import React from 'react';
import { View } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
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
import { DraggableCardWithCheckbox } from '../../../components/draggable-card-with-check-box/draggable-card-with-check-box';

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

    private renderBlockchain(
        item: { key: Blockchain; value: IBlockchainOptions },
        move: () => void,
        isActive: boolean
    ) {
        const networkAvailable = hasNetwork(item.key, this.props.testNet);
        const BlockchainIcon = getBlockchain(item.key).config.iconComponent;

        return (
            <DraggableCardWithCheckbox
                mainText={item.key}
                isActive={item.value.active}
                checkBox={{
                    visible: true,
                    onPress: () => {
                        if (!networkAvailable) {
                            Dialog.info(
                                translate('Settings.networkNotAvailable'),
                                translate('Settings.switchNetwork')
                            );
                        } else {
                            if (
                                item.value.active === true &&
                                this.props.nrActiveBlockchains === 1
                            ) {
                                Dialog.info(
                                    translate('App.labels.warning'),
                                    translate('Settings.cannotDeactivateAllBlockchains')
                                );
                            } else this.props.setBlockchainActive(item.key, !item.value.active);
                        }
                    }
                }}
                draggable={{
                    visible: true,
                    onPress: move,
                    isDragging: isActive
                }}
                imageIcon={{ iconComponent: BlockchainIcon }}
                extraData={{
                    networkAvailable
                }}
            />
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
                        `${item.key}`
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
