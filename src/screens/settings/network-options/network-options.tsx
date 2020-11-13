import React from 'react';
import { View, Switch, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { Text } from '../../../library';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../core/i18n';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { INetworksOptions } from '../../../redux/preferences/state';
import { toggleTestNet } from '../../../redux/preferences/actions';
import { ICON_SIZE } from '../../../styles/dimensions';
import { Blockchain } from '../../../core/blockchain/types';
import { isFeatureActive, RemoteFeature } from '../../../core/utils/remote-feature-config';
import { getNetworks } from '../../../redux/preferences/selectors';
import { IconValues } from '../../../components/icon/values';

export interface IReduxProps {
    testNet: boolean;
    toggleTestNet: typeof toggleTestNet;
    networksOptions: INetworksOptions;
}

const mapDispatchToProps = {
    toggleTestNet
};

const mapStateToProps = (state: IReduxState) => ({
    testNet: state.preferences.testNet,
    networksOptions: getNetworks(state)
});

const navigationOptions = () => ({
    title: translate('NetworkOptions.title')
});

export class NetworkOptionsComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles, theme, testNet, networksOptions, navigation } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.textRow}>{translate('NetworkOptions.testnet')}</Text>
                    <View style={styles.switch}>
                        <Switch
                            testID="toggle-testnet"
                            onValueChange={() => this.props.toggleTestNet()}
                            value={testNet}
                            trackColor={{
                                true: this.props.theme.colors.cardBackground,
                                false: this.props.theme.colors.cardBackground
                            }}
                            thumbColor={testNet ? theme.colors.accent : theme.colors.cardBackground}
                        />
                    </View>
                </View>

                <View style={styles.divider} />

                {networksOptions &&
                    Object.keys(networksOptions).map((blockchain: Blockchain, index: number) => {
                        if (
                            blockchain === Blockchain.COSMOS &&
                            isFeatureActive(RemoteFeature.COSMOS) === false
                        ) {
                            return <View key={index} />;
                        }
                        if (
                            blockchain === Blockchain.CELO &&
                            isFeatureActive(RemoteFeature.CELO) === false
                        ) {
                            return <View key={index} />;
                        }
                        if (
                            blockchain === Blockchain.SOLANA &&
                            isFeatureActive(RemoteFeature.SOLANA) === false
                        ) {
                            return <View key={index} />;
                        }

                        return (
                            <View key={index}>
                                <TouchableOpacity
                                    testID={blockchain.toLocaleLowerCase()}
                                    style={styles.rowContainer}
                                    disabled={!testNet}
                                    onPress={() =>
                                        navigation.navigate('NetworkSelection', {
                                            blockchain,
                                            testNet
                                        })
                                    }
                                >
                                    <Text style={styles.textRow}>{blockchain}</Text>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.rightText}>
                                            {testNet
                                                ? getBlockchain(blockchain).networks.find(
                                                      network =>
                                                          network.chainId ===
                                                          networksOptions[blockchain].testNet
                                                  ).name
                                                : translate('NetworkOptions.mainnet')}
                                        </Text>
                                        <Icon
                                            name={IconValues.CHEVRON_RIGHT}
                                            size={ICON_SIZE / 2}
                                            style={{
                                                color: testNet
                                                    ? theme.colors.accent
                                                    : theme.colors.cardBackground
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.divider} />
                            </View>
                        );
                    })}
            </View>
        );
    }
}

export const NetworkOptionsScreen = smartConnect(NetworkOptionsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
