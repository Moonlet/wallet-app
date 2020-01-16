import React from 'react';
import { View, FlatList, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { createHWWallet } from '../../../redux/wallets/actions';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { BottomSheetHeader } from '../../../components/bottom-sheet/header/header';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';
import { Icon } from '../../../components/icon';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { Blockchain } from '../../../core/blockchain/types';
import { HWVendor, HWModel, HWConnection } from '../../../core/wallet/hw-wallet/types';
import { delay } from '../../../core/utils/time';
import { TransportFactory } from '../../../core/wallet/hw-wallet/ledger/transport-factory';
import TouchableOpacity from '../../../library/touchable-opacity/touchable-opacity';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    onOpenStart: () => void;
    onCloseEnd: () => void;
}

interface IReduxProps {
    verifyAddress: boolean;
    featureNotSupported: boolean;
    createHWWallet: (
        deviceId: string,
        deviceVendor: HWVendor,
        deviceModel: HWModel,
        connectionType: HWConnection,
        blockchain: Blockchain
    ) => // navigation: NavigationScreenProp<NavigationState>
    Promise<any>;
}

interface IState {
    devices: any; // [];
    error: Error;
    loadingConnection: boolean;
    openApp: boolean;
    ledgerDevice: any;
}

export class LedgerConnectComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public bottomSheet: any;
    public scannerUnsubscribe = null;

    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.bottomSheet = React.createRef();

        this.state = {
            devices: [], // []
            error: null,
            loadingConnection: false,
            openApp: false,
            ledgerDevice: undefined
        };
    }

    public createWallet(deviceId: string) {
        this.props
            .createHWWallet(
                deviceId,
                HWVendor.LEDGER,
                this.props.deviceModel,
                this.props.connectionType,
                this.props.blockchain
                // this.props.navigation
            )
            .then(() => {
                this.props.onCloseEnd();
                if (this.scannerUnsubscribe) {
                    this.scannerUnsubscribe.unsubscribe();
                }
            })
            .catch(() => {
                if (this.scannerUnsubscribe) {
                    this.scannerUnsubscribe.unsubscribe();
                }
            });
    }

    public deviceAddition = device => ({ devices }) => ({
        devices: devices.some(i => i.id === device.id) ? devices : devices.concat(device)
    });

    public async componentDidMount() {
        Platform.OS === 'web'
            ? this.bottomSheet.current.props.onOpenStart()
            : this.bottomSheet.current.snapTo(1);

        await delay(500);
        this.scannerUnsubscribe = await TransportFactory.scan(this.props.connectionType, event => {
            this.setState(this.deviceAddition(event.data));
            if (this.props.connectionType === HWConnection.USB) {
                this.connect(event.data);
            }
        });
    }
    public async connect(item) {
        this.setState({ ledgerDevice: item, loadingConnection: true });
        try {
            await TransportFactory.connect(this.props.connectionType, item);
            this.scannerUnsubscribe.unsubscribe();
            this.setState({
                openApp: true,
                loadingConnection: false
            });
            this.createWallet(item.id);
        } catch (error) {
            this.setState({ ledgerDevice: undefined, loadingConnection: false });
            // show error
        }
    }

    public renderDeviceItem = item => {
        const name =
            item.localName !== undefined
                ? item.localName
                : translate(`CreateHardwareWallet.${this.props.deviceModel}`);

        return (
            <TouchableOpacity
                key={`key-${item.id}`}
                style={this.props.styles.deviceRow}
                onPress={async () => {
                    this.connect(item);
                }}
            >
                <View key="icon-background" style={this.props.styles.deviceIconBackground}>
                    <Icon
                        name="ledger-logo"
                        size={24}
                        style={[
                            this.props.styles.deviceIcon,
                            this.state.ledgerDevice?.id === item.id &&
                            this.state.loadingConnection === false
                                ? this.props.styles.deviceIconPaired
                                : null
                        ]}
                    />
                </View>
                <View key="device-details" style={this.props.styles.deviceDetails}>
                    <Text>
                        <Text style={this.props.styles.deviceName}>{name}</Text>
                        {this.state.ledgerDevice?.id === item.id &&
                            this.state.loadingConnection === false && (
                                <Text style={this.props.styles.pairedText}>
                                    {` ${translate('CreateHardwareWallet.paired')}`}
                                </Text>
                            )}
                    </Text>
                    <Text style={this.props.styles.deviceId}>{item.id}</Text>
                </View>
                <View>
                    {this.state.ledgerDevice === item && this.state.loadingConnection && (
                        <LoadingIndicator />
                    )}

                    {this.state.ledgerDevice?.id === item.id && !this.state.loadingConnection && (
                        <Icon name="check-1" size={16} style={this.props.styles.icon} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    public renderMessage() {
        const styles = this.props.styles;

        if (this.props.featureNotSupported === true) {
            return (
                <Text style={styles.message}>{translate('CreateHardwareWallet.notSupported')}</Text>
            );
        } else {
            return [
                <Text key="message" style={styles.message}>
                    {this.props.verifyAddress
                        ? translate('CreateHardwareWallet.verifyAddress', {
                              app: this.props.blockchain
                          })
                        : this.state.openApp
                        ? translate('CreateHardwareWallet.openApp', {
                              app: this.props.blockchain
                          })
                        : ''}
                </Text>,
                <View key="loading">
                    <LoadingIndicator />
                </View>
            ];
        }
    }

    public renderBottomSheetContent = () => {
        const { styles } = this.props;

        return (
            <View style={[styles.content, { height: this.props.snapPoints.bottomSheetHeight }]}>
                {(this.state.openApp || this.props.verifyAddress) &&
                this.state.ledgerDevice !== undefined ? (
                    <View style={styles.scanningContainer}>
                        {this.renderDeviceItem(this.state.ledgerDevice)}
                        {this.renderMessage()}
                    </View>
                ) : this.state.devices.length === 0 ? (
                    <View style={styles.scanningContainer}>
                        <Text style={styles.scanningDevices}>
                            {translate('CreateHardwareWallet.scanningDevices')}
                        </Text>
                        <View>
                            <LoadingIndicator />
                        </View>
                    </View>
                ) : (
                    <FlatList
                        extraData={this.state.error}
                        data={this.state.devices}
                        renderItem={({ item }) => this.renderDeviceItem(item)}
                        keyExtractor={(item, index) => `device-${index}`}
                    />
                )}
            </View>
        );
    };

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={this.props.snapPoints.initialSnap}
                snapPoints={[
                    this.props.snapPoints.initialSnap,
                    this.props.snapPoints.bottomSheetHeight
                ]}
                renderContent={this.renderBottomSheetContent}
                renderHeader={() => <BottomSheetHeader obRef={this.bottomSheet} />}
                onOpenStart={this.props.onOpenStart}
                onCloseEnd={() => {
                    this.props.onCloseEnd();
                    if (this.scannerUnsubscribe) {
                        this.scannerUnsubscribe.unsubscribe();
                    }
                }}
            />
        );
    }
}

const mapDispatchToProps = {
    createHWWallet
};

export const LedgerConnect = smartConnect<IExternalProps>(LedgerConnectComponent, [
    withTheme(stylesProvider),
    connect(
        (state: IReduxState) => ({
            verifyAddress: state.screens.connectHardwareWallet.verifyAddress,
            featureNotSupported: state.screens.connectHardwareWallet.featureNotSupported
        }),
        mapDispatchToProps
    )
]);
