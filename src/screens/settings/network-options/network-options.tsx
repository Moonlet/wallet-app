import React from 'react';
import { View, Switch, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { Text } from '../../../library';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../core/i18n';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { INetworksOptions } from '../../../redux/app/state';
import { setTestNet } from '../../../redux/app/actions';
import { ICON_SIZE } from '../../../styles/dimensions';

export interface IReduxProps {
    testNet: boolean;
    setTestNet: typeof setTestNet;
    appNetworks: INetworksOptions;
}

const mapDispatchToProps = {
    setTestNet
};

const mapStateToProps = (state: IReduxState) => ({
    testNet: state.app.testNet,
    appNetworks: state.app.networks
});

const navigationOptions = () => ({
    title: translate('NetworkOptions.title')
});

export class NetworkOptionsComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles, theme, testNet, appNetworks, navigation } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.textRow}>{translate('NetworkOptions.testnet')}</Text>
                    <View style={styles.switch}>
                        <Switch
                            onValueChange={() => this.props.setTestNet()}
                            value={testNet}
                            trackColor={{
                                true: this.props.theme.colors.cardBackground,
                                false: this.props.theme.colors.primary
                            }}
                            thumbColor={testNet ? theme.colors.accent : theme.colors.primary}
                        />
                    </View>
                </View>

                <View style={styles.divider} />

                {appNetworks
                    ? Object.keys(appNetworks).map((network: any, index: number) => (
                          <View key={index}>
                              <TouchableOpacity
                                  style={styles.rowContainer}
                                  disabled={!testNet}
                                  onPress={() =>
                                      navigation.navigate('NetworkSelectionScreen', {
                                          selectedNetwork: network,
                                          testNet
                                      })
                                  }
                              >
                                  <Text style={styles.textRow}>{network}</Text>
                                  <View style={styles.rightContainer}>
                                      <Text style={styles.rightText}>
                                          {testNet
                                              ? getBlockchain(network).networks.find(
                                                    n => n.chainId === appNetworks[network].testNet
                                                ).name
                                              : translate('NetworkOptions.mainnet')}
                                      </Text>
                                      <Icon
                                          name="arrow-right-1"
                                          size={ICON_SIZE / 2}
                                          style={{
                                              color: testNet
                                                  ? theme.colors.accent
                                                  : theme.colors.primary
                                          }}
                                      />
                                  </View>
                              </TouchableOpacity>
                              <View style={styles.divider} />
                          </View>
                      ))
                    : null}
            </View>
        );
    }
}

export const NetworkOptionsScreen = smartConnect(NetworkOptionsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
