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
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { ListCard } from '../../components/list-card/list-card';
import { BluetoothDevicesModal } from '../../components/bluetooth-devices/bluetooth-devices';
import { NavigationActions } from 'react-navigation';

export interface IReduxProps {
    tosVersion: number;
    verifyAddressMessage: boolean;
    walletCreated: boolean;
    createHWWallet: (
        deviceId: string,
        deviceVendor: HWVendor,
        deviceModel: HWModel,
        connectionType: HWConnection,
        blockchain: Blockchain
    ) => Promise<any>;
}

export interface IState {
    openAppOnDevice: boolean;
    device: HWModel;
    blockchain: Blockchain;
    selectConnection: boolean;
}

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: 'Add Wallet'
});

export class ConnectHardwareWalletScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    public static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.walletCreated === true) {
            nextProps.navigation.navigate(
                'MainNavigation',
                {},
                NavigationActions.navigate({ routeName: 'Dashboard' })
            );
        }
        return prevState;
    }
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
                        customStyle={{ height: 60, width: 180, marginRight: 20 }}
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
                        customStyle={{ height: 60, width: 180, marginRight: 20 }}
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
            <ScrollView style={styles.container}>
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
                        label={
                            translate('CreateHardwareWallet.selectDevice') +
                            translate('CreateHardwareWallet.' + key)
                        }
                        rightIcon={this.state.device === HWModel[key] && 'check-1'}
                        selected={this.state.device === HWModel[key]}
                    />
                ))}

                {this.state.device !== undefined &&
                    this.renderConnectionTypes(config[this.state.device].connectionTypes)}

                {this.state.device !== undefined &&
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
                            : translate('CreateHardwareWallet.openAppOnDevice') +
                              this.state.blockchain +
                              translate('CreateHardwareWallet.onDevice')}
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
            this.state.blockchain
        );
    }

    public render() {
        const props = this.props;
        return (
            <View style={props.styles.container}>
                {Platform.select({
                    ios: this.renderConfig(ledgerConfig.ios),
                    android: this.renderConfig(ledgerConfig.android),
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
                        primary
                        onPress={async () => {
                            if (this.connection === HWConnection.BLE) {
                                this.bluetoothModal.open();
                            } else {
                                this.createWallet(''); // todo - take deviceId USB if possible
                            }
                        }}
                    >
                        {translate('App.labels.next')}
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
            verifyAddressMessage: state.screens.connectHardwareWallet.verifyAddress,
            walletCreated: state.screens.connectHardwareWallet.hardwareWalletCreated
        }),
        {
            createHWWallet
        }
    ),
    withTheme(stylesProvider)
]);
