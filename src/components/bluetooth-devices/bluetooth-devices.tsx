import React from 'react';
import { Modal, FlatList, TouchableOpacity, View } from 'react-native';
import stylesProvider from './styles';
import { Text } from '../../library';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { ICON_SIZE } from '../../styles/dimensions';
import { Icon } from '../icon';
import { BLE } from '../../core/wallet/hw-wallet/ledger/transport/transport-ble';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';

export interface IExternalProps {
    ref: any;
    onComplete: (deviceId: string) => void;
}

interface IState {
    devices: [];
    isVisible: boolean;
    error: Error;
    refreshing: boolean;
}

const deviceAddition = device => ({ devices }) => ({
    devices: devices.some(i => i.id === device.id) ? devices : devices.concat(device)
});

export class BluetoothDevicesModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public scannerUnsubscribe = null;
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            devices: [],
            isVisible: false,
            error: null,
            refreshing: false
        };
        props.ref && props.ref(this);
    }

    public open = async () => {
        this.setState({ isVisible: true });

        this.scannerUnsubscribe = await BLE.scan(event => {
            this.setState(deviceAddition(event.data));
        });
    };

    public renderItem = item => {
        return (
            <TouchableOpacity
                style={this.props.styles.deviceRow}
                onPress={async () => {
                    try {
                        await BLE.connect(item.id);
                        this.scannerUnsubscribe.unsubscribe();
                        this.props.onComplete(item.id);
                        this.setState({ isVisible: false });
                    } catch (error) {
                        // show error
                    }
                }}
            >
                <Text style={this.props.styles.text}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    public renderHeader = () => {
        const styles = this.props.styles;
        const { error } = this.state;
        return error ? (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sorry, an error occured</Text>
                <Text style={styles.errorTitle}>{String(error.message)}</Text>
            </View>
        ) : (
            <View style={styles.header}>
                <TouchableOpacity
                    testID="button-close"
                    style={styles.close}
                    onPress={() => {
                        // unsubscribe
                        this.scannerUnsubscribe.unsubscribe();
                        this.setState({ isVisible: false });
                    }}
                >
                    <Icon name="close" size={ICON_SIZE} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scanning for Bluetooth...</Text>
                <LoadingIndicator />
            </View>
        );
    };

    public render() {
        const { devices, error, refreshing } = this.state;
        const styles = this.props.styles;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isVisible}
                presentationStyle={'overFullScreen'}
            >
                <View style={styles.container}>
                    <FlatList
                        extraData={error}
                        style={styles.modalContainer}
                        data={devices}
                        renderItem={({ item }) => this.renderItem(item)}
                        keyExtractor={item => `${item}`}
                        ListHeaderComponent={this.renderHeader}
                        refreshing={refreshing}
                    />
                </View>
            </Modal>
        );
    }
}

export const BluetoothDevicesModal = smartConnect<IExternalProps>(BluetoothDevicesModalComponent, [
    withTheme(stylesProvider)
]);
