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
import { toggleTestNet } from '../../../redux/app/actions';
import { ICON_SIZE } from '../../../styles/dimensions';
import { Blockchain } from '../../../core/blockchain/types';
import { themes } from '../../../navigation/navigation';

export interface IReduxProps {
    testNet: boolean;
    toggleTestNet: typeof toggleTestNet;
    networksOptions: INetworksOptions;
}

const mapDispatchToProps = {
    toggleTestNet
};

const mapStateToProps = (state: IReduxState) => ({
    testNet: state.app.testNet,
    networksOptions: state.app.networks
});

const navigationOptions = ({ theme }: any) => ({
    title: translate('NetworkOptions.title'),
    headerStyle: {
        backgroundColor: themes[theme].colors.header
    }
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
                            onValueChange={() => this.props.toggleTestNet()}
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

                {networksOptions &&
                    Object.keys(networksOptions).map((blockchain: Blockchain, index: number) => (
                        <View key={index}>
                            <TouchableOpacity
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
                    ))}
            </View>
        );
    }
}

export const NetworkOptionsScreen = smartConnect(NetworkOptionsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
