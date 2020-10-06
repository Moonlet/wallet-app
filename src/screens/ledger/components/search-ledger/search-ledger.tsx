import React from 'react';
import { View, FlatList } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';
import { translate } from '../../../../core/i18n';
import { TransportFactory } from '../../../../core/wallet/hw-wallet/ledger/transport-factory';
import { IconValues } from '../../../../components/icon/values';
import { ListCard } from '../../../../components/list-card/list-card';
import ImgNanoS from '../../../../assets/icons/ledger/connect-nano-s.svg';
import ImgNanoX from '../../../../assets/icons/ledger/search-bluetooth.svg';
import { normalize } from '../../../../styles/dimensions';
import { svgDimmensions } from '../../ledger-connect-component';
import { SmartImage } from '../../../../library/image/smart-image';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    deviceId: string;
    onSelect: () => void;
    onConnect: (item: any) => void;
    onError: (error: any) => void;
}

interface IState {
    devices: any; // [];
    error: Error;
}

export class SearchLedgerComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public scannerUnsubscribe = null;
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            devices: [], // []
            error: null
        };
    }
    public deviceAddition = device => ({ devices }) => ({
        devices: devices.some(i => i.id === device.id) ? devices : devices.concat(device)
    });

    public async componentDidMount() {
        const permissionsEnabled = await TransportFactory.requestPermissions(
            this.props.connectionType
        );

        if (!permissionsEnabled) {
            this.props.onError(new Error('Location disabled'));
        } else
            this.scannerUnsubscribe = await TransportFactory.scan(
                this.props.connectionType,
                event => {
                    this.setState(this.deviceAddition(event.data));
                    if (this.props.connectionType === HWConnection.USB) {
                        //
                    } else {
                        if (
                            event.data?.id &&
                            this.props.deviceId &&
                            this.props.deviceId === event.data?.id
                        ) {
                            this.connect(event.data);
                        }
                    }
                }
            );
    }

    public async connect(item) {
        try {
            if (this.props.connectionType === HWConnection.BLE) {
                this.props.onSelect();
            }

            await TransportFactory.connect(this.props.connectionType, item);

            this.scannerUnsubscribe.unsubscribe();
            this.props.onConnect(item);
        } catch (error) {
            this.props.onError(error);
        }
    }

    public renderDeviceItem = item => {
        const name =
            item.localName !== undefined
                ? item.localName
                : translate(`LedgerConnect.${this.props.deviceModel}`);

        return (
            <ListCard
                key={`key`}
                label={name}
                leftIcon={IconValues.LEDGER_LOOGO}
                // TODO: this should be String `Rename`
                // rightIcon={IconValues.CHECK}
                selected={false}
                onPress={() => this.connect(item)}
            />
        );
    };

    public render() {
        const { styles } = this.props;

        const isNanoS = this.props.deviceModel === HWModel.NANO_S;

        return (
            <View style={styles.container}>
                {isNanoS ? (
                    <SmartImage
                        source={{ iconComponent: ImgNanoS }}
                        style={{
                            width: normalize(svgDimmensions.width),
                            height: normalize(svgDimmensions.height)
                        }}
                    />
                ) : (
                    <SmartImage
                        source={{ iconComponent: ImgNanoX }}
                        style={{
                            width: normalize(svgDimmensions.width),
                            height: normalize(svgDimmensions.height)
                        }}
                    />
                )}

                <View style={{ flex: 1 }}>
                    <Text style={styles.primaryText}>
                        {translate('LedgerConnect.searchFor') +
                            ' ' +
                            translate(`LedgerConnect.${this.props.deviceModel}`)}
                    </Text>

                    <Text style={styles.secondaryText}>
                        {translate(`LedgerConnect.${this.props.deviceModel}_CONNECTED`)}
                    </Text>

                    <View style={styles.loadingContainer}>
                        {this.state.devices.length ? (
                            <FlatList
                                extraData={this.state.error}
                                data={this.state.devices}
                                renderItem={({ item }) => this.renderDeviceItem(item)}
                                keyExtractor={(item, index) => `device-${index}`}
                            />
                        ) : (
                            <LoadingIndicator />
                        )}
                    </View>

                    {isNanoS && (
                        <Text style={styles.noteText}>
                            {translate('LedgerConnect.onlyAndroid')}
                        </Text>
                    )}
                </View>
            </View>
        );
    }
}

export const SearchLedger = smartConnect<IExternalProps>(SearchLedgerComponent, [
    withTheme(stylesProvider)
]);
