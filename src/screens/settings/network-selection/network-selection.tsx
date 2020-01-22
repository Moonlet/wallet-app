import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IBlockchainNetwork, Blockchain } from '../../../core/blockchain/types';
import { setNetworkTestNetChainId } from '../../../redux/app/actions';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { INetworksOptions } from '../../../redux/preferences/state';

export interface INavigationParams {
    blockchain: Blockchain;
    testNet: boolean;
    appNetworks: INetworksOptions;
    setNetworkTestNetChainId: typeof setNetworkTestNetChainId;
}

const mapDispatchToProps = {
    setNetworkTestNetChainId
};

const mapStateToProps = (state: IReduxState) => ({
    appNetworks: state.app.networks
});

const navigationOptions = ({ navigation }: any) => ({
    title: navigation.state.params.blockchain
});

export class NetworkSelectionComponent extends React.Component<
    INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles, appNetworks } = this.props;
        const { testNet, blockchain } = this.props.navigation.state.params;

        const networks = getBlockchain(blockchain)?.networks;

        return (
            <View style={styles.container}>
                {networks &&
                    networks.map(
                        (network: IBlockchainNetwork, index: number) =>
                            !testNet === network.mainNet && (
                                <View key={index}>
                                    <TouchableOpacity
                                        style={styles.rowContainer}
                                        onPress={() =>
                                            this.props.setNetworkTestNetChainId(
                                                blockchain,
                                                network.chainId
                                            )
                                        }
                                    >
                                        <Text style={styles.textRow}>{network.name}</Text>
                                        <View style={styles.rightContainer}>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={styles.rightText}
                                            >
                                                {network.url}
                                            </Text>
                                            {appNetworks[blockchain].testNet ===
                                                network.chainId && (
                                                <Icon
                                                    name="check-1"
                                                    size={16}
                                                    style={styles.icon}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.divider} />
                                </View>
                            )
                    )}
            </View>
        );
    }
}

export const NetworkSelectionScreen = smartConnect(NetworkSelectionComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
