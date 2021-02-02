import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IBlockchainNetwork, Blockchain } from '../../../core/blockchain/types';
import { setNetworkTestNetChainId } from '../../../redux/preferences/actions';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { INetworksOptions } from '../../../redux/preferences/state';
import { normalize } from '../../../styles/dimensions';
import { IconValues } from '../../../components/icon/values';
import { isFeatureActive, RemoteFeature } from '../../../core/utils/remote-feature-config';
import { IReduxState } from '../../../redux/state';
import { getNetworks } from '../../../redux/preferences/selectors';

interface INavigationParams {
    blockchain: Blockchain;
    testNet: boolean;

    setNetworkTestNetChainId: typeof setNetworkTestNetChainId;
}

const mapDispatchToProps = {
    setNetworkTestNetChainId
};
const mapStateToProps = (state: IReduxState) => ({
    appNetworks: getNetworks(state)
});
const navigationOptions = ({ navigation }: any) => ({
    title: navigation.state.params.blockchain
});

interface IReduxProps {
    appNetworks: INetworksOptions;
}

interface IState {
    networks: IBlockchainNetwork[];
}

export class NetworkSelectionComponent extends React.Component<
    IReduxProps &
        INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IReduxProps &
            INavigationProps<INavigationParams> &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            networks: undefined
        };
    }

    public static navigationOptions = navigationOptions;

    public componentDidMount() {
        const { blockchain } = this.props.navigation.state.params;

        const networks = [];

        getBlockchain(blockchain)?.networks.map(network => {
            if (network.chainId === '4' && blockchain === Blockchain.SOLANA) {
                if (isFeatureActive(RemoteFeature.DEV_TOOLS)) networks.push(network);
            } else networks.push(network);
        });
        this.setState({ networks });
    }

    public render() {
        const { styles, appNetworks } = this.props;
        const { testNet, blockchain } = this.props.navigation.state.params;

        return (
            <View testID="network-selection-screen" style={styles.container}>
                {this.state.networks &&
                    this.state.networks.map(
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
                                                    name={IconValues.CHECK}
                                                    size={normalize(16)}
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
