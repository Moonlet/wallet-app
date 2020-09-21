import React from 'react';
import { View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text } from '../../library';
import { Button } from '../../library/button/button';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';
import { ledgerConfig } from '../../core/wallet/hw-wallet/ledger/config';
import { Blockchain } from '../../core/blockchain/types';
import { ListCard } from '../../components/list-card/list-card';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';
import { themes } from '../../navigation/navigation';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { Capitalize } from '../../core/utils/format-string';
import { delay } from '../../core/utils/time';
import { IconValues } from '../../components/icon/values';
import bind from 'bind-decorator';
import { setDisplayLedgerConnect } from '../../redux/ui/ledger-connect/actions';

export interface IReduxProps {
    setDisplayLedgerConnect: typeof setDisplayLedgerConnect;
}

export interface IState {
    device: HWModel;
    blockchain: Blockchain;
    connection: HWConnection;
    blockchainActive: boolean;
    ledgerTypeActive: boolean;
    connectionActive: boolean;
}

const mapDispatchToProps = {
    setDisplayLedgerConnect
};

const navigationOptions = ({ navigation, theme }: any) => ({
    title: translate('App.labels.connect'),
    headerRight: () => (
        <TouchableOpacity onPress={navigation.state?.params?.resetAll}>
            <Text
                style={{
                    fontSize: normalizeFontAndLineHeight(17),
                    lineHeight: normalizeFontAndLineHeight(22),
                    color: themes[theme].colors.accent,
                    paddingRight: BASE_DIMENSION * 2
                }}
            >
                {translate('App.labels.resetAll')}
            </Text>
        </TouchableOpacity>
    )
});

export class ConnectHardwareWalletScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: any) {
        super(props);

        this.state = {
            device: undefined,
            blockchain: undefined,
            connection: undefined,
            blockchainActive: true,
            ledgerTypeActive: false,
            connectionActive: false
        };
    }

    @bind
    public resetAll() {
        this.setState({
            device: undefined,
            blockchain: undefined,
            connection: undefined,
            blockchainActive: true,
            ledgerTypeActive: false,
            connectionActive: false
        });
    }

    public componentDidMount() {
        this.props.navigation.setParams({ resetAll: this.resetAll });
    }

    public renderHeader() {
        const styles = this.props.styles;
        const { ledgerTypeActive, connectionActive } = this.state;

        return [
            <View key="header" style={styles.headerRow}>
                <View key="circle-1" style={[styles.circle, styles.circleSelected]}>
                    <Text key="number-1" style={[styles.number, styles.numberSelected]}>{`1`}</Text>
                </View>

                <View
                    key="divider-1"
                    style={[
                        styles.divider,
                        ledgerTypeActive || this.state.device !== undefined
                            ? styles.dividerSelected
                            : null
                    ]}
                />

                <View
                    key="circle-2"
                    style={[
                        styles.circle,
                        ledgerTypeActive || this.state.device !== undefined
                            ? styles.circleSelected
                            : null
                    ]}
                >
                    <Text
                        key="number-2"
                        style={[
                            styles.number,
                            ledgerTypeActive || this.state.device !== undefined
                                ? styles.numberSelected
                                : null
                        ]}
                    >
                        {`2`}
                    </Text>
                </View>

                <View
                    key="divider-2"
                    style={[
                        styles.divider,
                        connectionActive || this.state.connection !== undefined
                            ? styles.dividerSelected
                            : null
                    ]}
                />

                <View
                    key="circle-3"
                    style={[
                        styles.circle,
                        connectionActive || this.state.connection !== undefined
                            ? styles.circleSelected
                            : null
                    ]}
                >
                    <Text
                        key="number-3"
                        style={[
                            styles.number,
                            connectionActive || this.state.connection !== undefined
                                ? styles.numberSelected
                                : null
                        ]}
                    >
                        {`3`}
                    </Text>
                </View>
            </View>,
            <View key="view-description" style={styles.headerDescription}>
                <Text style={styles.text}>{translate('App.labels.network')}</Text>
                <Text style={styles.text}>{translate('App.labels.ledgerType')}</Text>
                <Text style={styles.text}>{translate('App.labels.connection')}</Text>
            </View>
        ];
    }

    public renderConfig(object: {
        [platform: string]: {
            [blockchains: string]: {
                // Model
                [deviceModel: string]: {
                    connectionTypes: HWConnection[];
                };
            };
        };
    }) {
        const config = object[Platform.OS];
        const styles = this.props.styles;
        const { blockchainActive, ledgerTypeActive, connectionActive } = this.state;

        const blockchains = Object.keys(config);

        return (
            <ScrollView style={styles.container} key={Platform.OS}>
                {this.renderHeader()}

                {(this.state.blockchain !== undefined ||
                    this.state.device !== undefined ||
                    this.state.connection !== undefined) && (
                    <View style={{ marginBottom: BASE_DIMENSION * 4 }}>
                        {this.state.blockchain !== undefined && (
                            <ListCard
                                key={`key-${this.state.blockchain}`}
                                label={Capitalize(this.state.blockchain)}
                                leftIcon={IconValues.MONEY_WALLET}
                                rightIcon={IconValues.CHECK}
                                selected={true}
                            />
                        )}

                        {this.state.device !== undefined && (
                            <ListCard
                                key={`key-${this.state.device}`}
                                label={translate(`LedgerConnect.${this.state.device}`)}
                                leftIcon={IconValues.LEDGER_LOOGO}
                                rightIcon={IconValues.CHECK}
                                selected={true}
                            />
                        )}

                        {this.state.connection !== undefined && (
                            <ListCard
                                key={`key-${this.state.connection}`}
                                label={translate(`CreateHardwareWallet.${this.state.connection}`)}
                                leftIcon={String(this.state.connection).toLowerCase()}
                                rightIcon={IconValues.CHECK}
                                selected={true}
                            />
                        )}
                    </View>
                )}

                {blockchainActive &&
                    blockchains.map((key: Blockchain, index: number) => (
                        <ListCard
                            key={`blockchain-${index}`}
                            onPress={() =>
                                this.setState({
                                    blockchain: key,
                                    blockchainActive: false,
                                    ledgerTypeActive: true
                                })
                            }
                            label={Capitalize(key)}
                            leftIcon={IconValues.MONEY_WALLET}
                            rightIcon={this.state.blockchain === key && IconValues.CHECK}
                            selected={this.state.blockchain === key}
                        />
                    ))}

                {ledgerTypeActive &&
                    Object.keys(config[this.state.blockchain]).map(
                        (key: HWModel, index: number) => (
                            <ListCard
                                key={`device-${index}`}
                                onPress={() =>
                                    this.setState({
                                        device: key,
                                        ledgerTypeActive: false,
                                        connectionActive: true
                                    })
                                }
                                label={translate(`LedgerConnect.${key}`)}
                                leftIcon={IconValues.LEDGER_LOOGO}
                                rightIcon={this.state.device === key && IconValues.CHECK}
                                selected={this.state.device === key}
                            />
                        )
                    )}

                {connectionActive &&
                    config[this.state.blockchain][this.state.device].connectionTypes.map(
                        (connection: HWConnection, index: number) => (
                            <ListCard
                                key={`connection-${index}`}
                                onPress={() =>
                                    this.setState({
                                        connection,
                                        connectionActive: false
                                    })
                                }
                                label={translate(`CreateHardwareWallet.${connection}`)}
                                leftIcon={String(connection).toLowerCase()}
                                rightIcon={this.state.connection === connection && IconValues.CHECK}
                                selected={this.state.connection === connection}
                            />
                        )
                    )}
            </ScrollView>
        );
    }

    private async openBottomSheet() {
        await delay(500); // TODO: check here and find a solution to fix
        this.props.setDisplayLedgerConnect(
            true,
            this.state.blockchain,
            this.state.device,
            this.state.connection
        );
    }

    private async connect() {
        try {
            await PasswordModal.getPassword(undefined, undefined, {
                shouldCreatePassword: true
            });
            this.openBottomSheet();
        } catch (err) {
            try {
                await PasswordModal.createPassword();
                this.openBottomSheet();
            } catch (err) {
                //
            }
        }
    }

    public render() {
        const { styles } = this.props;
        const { blockchain, connection, device } = this.state;

        return (
            <View style={styles.container}>
                {this.renderConfig(ledgerConfig)}
                {(device && connection && blockchain) !== undefined && (
                    <View style={styles.bottomContainer}>
                        <Text style={styles.textIndicator}>
                            {translate('CreateHardwareWallet.app', {
                                app: blockchain
                            })}
                        </Text>
                        <Button
                            testID="button-next"
                            wrapperStyle={styles.bottomButton}
                            onPress={() => this.connect()}
                        >
                            {translate('App.labels.connect')}
                        </Button>
                    </View>
                )}
            </View>
        );
    }
}

export const ConnectHardwareWallet = smartConnect(ConnectHardwareWalletScreenComponent, [
    connect(null, mapDispatchToProps),
    withTheme(stylesProvider)
]);
