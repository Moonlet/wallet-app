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

export interface IReduxProps {
    tosVersion: number;
    //   verifyAddressMessage: boolean;
    createHWWallet: (
        deviceVendor: HWVendor,
        deviceModel: HWModel,
        connectionType: HWConnection,
        blockchain: Blockchain,
        password: string
    ) => Promise<any>;
}

export interface IState {
    connectDevice: boolean;
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
    public connection: HWConnection = undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            connectDevice: false,
            device: undefined,
            blockchain: undefined,
            selectConnection: undefined
        };
    }

    public renderConnectionTypes(connectionTypes: ConnectionType) {
        const styles = this.props.styles;
        if (connectionTypes.length === 1) {
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
                        onPress={() => this.setState({ blockchain: blockchains[index] })}
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

    public render() {
        const props = this.props;
        return (
            <View style={props.styles.container}>
                {Platform.select({
                    ios: this.renderConfig(ledgerConfig.ios),
                    android: this.renderConfig(ledgerConfig.android),
                    web: this.renderConfig(ledgerConfig.web)
                })}
                {this.state.connectDevice && (
                    <View style={props.styles.activityContainer}>
                        <Text style={props.styles.textIndicator}>
                            {translate('CreateHardwareWallet.waitDevice')}
                        </Text>
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                )}
                <View style={props.styles.bottomContainer}>
                    <Button
                        testID="button-next"
                        style={props.styles.bottomButton}
                        primary
                        onPress={async () => {
                            this.setState({ connectDevice: true });

                            this.props.createHWWallet(
                                HWVendor.LEDGER,
                                this.state.device,
                                this.connection,
                                this.state.blockchain,
                                'pass'
                            );

                            // const hdWallet = await WalletFactory.get('walletid', WalletType.HW, {
                            //     deviceVendor: HWVendor.LEDGER,
                            //     connectionType: HWConnection.BLE,
                            //     deviceModel: HWModel.NANO_X,
                            //     blockchain: this.state.blockchain
                            //     deviceId: 'dddd'
                            // });
                        }}
                    >
                        {translate('App.labels.next')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const ConnectHardwareWallet = smartConnect(ConnectHardwareWalletScreenComponent, [
    connect(
        (state: IReduxState) => ({
            tosVersion: state.app.tosVersion
        }),
        {
            createHWWallet
        }
    ),
    withTheme(stylesProvider)
]);
