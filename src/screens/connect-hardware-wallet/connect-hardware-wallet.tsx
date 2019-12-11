import React from 'react';
import { View, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Text } from '../../library';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { TOS_VERSION } from '../../core/constants/app';
import { createHWWallet } from '../../redux/wallets/actions';
import { HWVendor, HWModel, HWConnection, ConnectionType } from '../../core/wallet/hw-wallet/types';
import { ledgerConfig } from '../../core/wallet/hw-wallet/ledger/config';
import { Blockchain } from '../../core/blockchain/types';
import { ListCard } from '../../components/list-card/list-card';
import { BluetoothDevicesModal } from '../../components/bluetooth-devices/bluetooth-devices';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { HeaderLeft } from '../../components/header-left/header-left';
import { INavigationProps } from '../../navigation/with-navigation-params';

export interface IReduxProps {
    tosVersion: number;
    verifyAddressMessage: boolean;
    createHWWallet: (
        deviceId: string,
        deviceVendor: HWVendor,
        deviceModel: HWModel,
        connectionType: HWConnection,
        blockchain: Blockchain,
        navigation: NavigationScreenProp<NavigationState>
    ) => Promise<any>;
}

export interface IState {
    openAppOnDevice: boolean;
    device: HWModel;
    blockchain: Blockchain;
    selectConnection: boolean;
}

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        if (navigation.state && navigation.state.params && navigation.state.params.goBack) {
            return (
                <HeaderLeft
                    icon="arrow-left-1"
                    text="Back"
                    onPress={() => {
                        navigation.state.params.goBack(navigation);
                    }}
                />
            );
        }

        return null;
    },
    title: translate('Wallets.addWalletTitle')
});

export class ConnectHardwareWalletScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    public connection: HWConnection = undefined;
    public bluetoothModal = null;

    constructor(props: any) {
        super(props);

        this.state = {
            openAppOnDevice: false,
            device: undefined,
            blockchain: undefined,
            selectConnection: undefined
        };

        if (!props.tosVersion || TOS_VERSION > props.tosVersion) {
            props.navigation.navigate('CreateWalletTerms');
        }
    }

    public renderConnectionTypes(connectionTypes: ConnectionType) {
        const styles = this.props.styles;
        if (connectionTypes.length === 1 && this.connection === undefined) {
            this.connection = HWConnection[connectionTypes[0]];
            return;
        }
        return [
            <Text key="connection-header" style={styles.text}>
                {'Select connection type'}
            </Text>,
            <View key="connection-container" style={styles.connectionContainer}>
                {connectionTypes.map((key, index) => (
                    <ListCard
                        key={'coonnection' + index}
                        style={{ height: 60, width: 180, marginRight: 20 }}
                        onPress={() => {
                            this.connection = HWConnection[connectionTypes[index]];
                            this.setState({ selectConnection: true });
                        }}
                        label={connectionTypes[index]}
                        rightIcon={
                            this.connection === HWConnection[connectionTypes[index]] && 'check-1'
                        }
                        selected={
                            this.connection &&
                            this.connection === HWConnection[connectionTypes[index]]
                        }
                    />
                ))}
            </View>
        ];
    }
    public renderBlockchains(blockchains: Blockchain[]) {
        const styles = this.props.styles;

        return [
            <Text key="blockchain-header" style={styles.text}>
                {'Select blockchain'}
            </Text>,
            <View key="blockchain-container" style={styles.connectionContainer}>
                {blockchains.map((key, index) => (
                    <ListCard
                        key={'blockchain' + index}
                        style={{ height: 60, width: 180, marginRight: 20 }}
                        onPress={() => {
                            this.setState({
                                blockchain: blockchains[index],
                                openAppOnDevice: true
                            });
                        }}
                        label={blockchains[index]}
                        rightIcon={this.state.blockchain === blockchains[index] && 'check-1'}
                        selected={this.state.blockchain === blockchains[index]}
                    />
                ))}
            </View>
        ];
    }

    public renderConfig(config: {
        [deviceModel: string]: {
            blockchains: Blockchain[];
            connectionTypes: ConnectionType;
        };
    }) {
        const styles = this.props.styles;

        const values = Object.keys(config);

        return (
            <ScrollView style={styles.container} key={Platform.OS}>
                <Text key="device-header" style={styles.text}>
                    {'Connect your ledger'}
                </Text>
                {values.map((key, index) => (
                    <ListCard
                        key={'device' + index}
                        onPress={() => {
                            this.setState({
                                device: HWModel[key],
                                selectConnection: false,
                                blockchain: undefined
                            });
                            this.connection = undefined;
                        }}
                        label={translate('CreateHardwareWallet.device', {
                            device: translate('CreateHardwareWallet.' + key)
                        })}
                        rightIcon={this.state.device === HWModel[key] && 'check-1'}
                        selected={this.state.device === HWModel[key]}
                    />
                ))}

                {config[this.state.device] !== undefined &&
                    this.renderConnectionTypes(config[this.state.device].connectionTypes)}

                {config[this.state.device] !== undefined &&
                    this.renderBlockchains(config[this.state.device].blockchains)}
            </ScrollView>
        );
    }

    public renderMessages() {
        const styles = this.props.styles;
        return (
            this.state.openAppOnDevice && (
                <View style={styles.activityContainer}>
                    <Text style={styles.textIndicator}>
                        {this.props.verifyAddressMessage
                            ? translate('CreateHardwareWallet.verifyAddress')
                            : translate('CreateHardwareWallet.app', {
                                  app: this.state.blockchain
                              })}
                    </Text>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )
        );
    }

    public onBluetoothConnected = (deviceId: string) => {
        this.createWallet(deviceId);
    };

    public createWallet(deviceId: string) {
        this.props.createHWWallet(
            deviceId,
            HWVendor.LEDGER,
            this.state.device,
            this.connection,
            this.state.blockchain,
            this.props.navigation
        );
    }

    public render() {
        const props = this.props;
        return (
            <View style={props.styles.container}>
                {Platform.select({
                    android: this.renderConfig(ledgerConfig.android),
                    ios: this.renderConfig(ledgerConfig.ios),
                    web: this.renderConfig(ledgerConfig.web)
                })}
                {this.renderMessages()}
                <View style={props.styles.bottomContainer}>
                    <Button
                        testID="button-next"
                        style={props.styles.bottomButton}
                        disabled={
                            (this.state.device && this.connection && this.state.blockchain) ===
                            undefined
                        }
                        onPress={async () => {
                            if (this.connection === HWConnection.BLE) {
                                this.bluetoothModal.open();
                            } else {
                                this.createWallet(''); // todo - take deviceId USB if possible
                            }
                        }}
                    >
                        {translate('App.labels.connect')}
                    </Button>
                </View>
                <BluetoothDevicesModal
                    obRef={ref => (this.bluetoothModal = ref)}
                    onComplete={this.onBluetoothConnected}
                />
            </View>
        );
    }
}

export const ConnectHardwareWallet = smartConnect(ConnectHardwareWalletScreenComponent, [
    connect(
        (state: IReduxState) => ({
            tosVersion: state.app.tosVersion,
            verifyAddressMessage: state.screens.connectHardwareWallet.verifyAddress
        }),
        {
            createHWWallet
        }
    ),
    withTheme(stylesProvider)
]);
