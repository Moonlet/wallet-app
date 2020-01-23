import React from 'react';
import { View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text } from '../../library';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { TOS_VERSION } from '../../core/constants/app';
import { HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';
import { ledgerConfig } from '../../core/wallet/hw-wallet/ledger/config';
import { Blockchain } from '../../core/blockchain/types';
import { ListCard } from '../../components/list-card/list-card';
import { HeaderLeft } from '../../components/header-left/header-left';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { themes } from '../../navigation/navigation';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { BottomSheetType } from '../../redux/ui/bottomSheet/state';

export interface IReduxProps {
    tosVersion: number;
    openBottomSheet: typeof openBottomSheet;
}

export interface IState {
    openAppOnDevice: boolean;
    device: HWModel;
    blockchain: Blockchain;
    connection: HWConnection;
    blockchainActive: boolean;
    ledgerTypeActive: boolean;
    connectionActive: boolean;
}

const mapDispatchToProps = {
    openBottomSheet
};

const navigationOptions = ({ navigation, theme }: any) => ({
    headerLeft: () =>
        navigation.state?.params?.goBack ? (
            <HeaderLeft
                icon="arrow-left-1"
                onPress={() => navigation.state.params.goBack(navigation)}
            />
        ) : null,
    title: translate('App.labels.connect'),
    headerRight: () => (
        <TouchableOpacity onPress={navigation.state?.params?.resetAll}>
            <Text
                style={{
                    fontSize: 17,
                    lineHeight: 22,
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
    public passwordModal = null;

    constructor(props: any) {
        super(props);

        this.state = {
            openAppOnDevice: false,
            device: undefined,
            blockchain: undefined,
            connection: undefined,
            blockchainActive: true,
            ledgerTypeActive: false,
            connectionActive: false
        };

        if (!props.tosVersion || TOS_VERSION > props.tosVersion) {
            props.navigation.navigate('CreateWalletTerms');
        }
    }

    public resetAll = () =>
        this.setState({
            device: undefined,
            blockchain: undefined,
            connection: undefined,
            blockchainActive: true,
            ledgerTypeActive: false,
            connectionActive: false
        });

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
                    >{`2`}</Text>
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
                    >{`3`}</Text>
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
                                label={translate(`CreateHardwareWallet.${this.state.blockchain}`)}
                                leftIcon="money-wallet-1"
                                rightIcon={'check-1'}
                                selected={true}
                            />
                        )}

                        {this.state.device !== undefined && (
                            <ListCard
                                key={`key-${this.state.device}`}
                                label={translate(`CreateHardwareWallet.${this.state.device}`)}
                                leftIcon="ledger-logo"
                                rightIcon={'check-1'}
                                selected={true}
                            />
                        )}

                        {this.state.connection !== undefined && (
                            <ListCard
                                key={`key-${this.state.connection}`}
                                label={translate(`CreateHardwareWallet.${this.state.connection}`)}
                                leftIcon={this.state.connection.toString()}
                                rightIcon={'check-1'}
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
                            label={translate(`CreateHardwareWallet.${key}`)}
                            leftIcon="money-wallet-1"
                            rightIcon={this.state.blockchain === key && 'check-1'}
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
                                label={translate(`CreateHardwareWallet.${key}`)}
                                leftIcon="ledger-logo"
                                rightIcon={this.state.device === key && 'check-1'}
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
                                leftIcon={connection.toString()} // TODO: replace this
                                rightIcon={this.state.connection === connection && 'check-1'}
                                selected={this.state.connection === connection}
                            />
                        )
                    )}
            </ScrollView>
        );
    }

    public render() {
        const props = this.props;
        return (
            <View style={props.styles.container}>
                {this.renderConfig(ledgerConfig)}
                {(this.state.device && this.state.connection && this.state.blockchain) !==
                    undefined && (
                    <View style={props.styles.bottomContainer}>
                        <Text style={props.styles.textIndicator}>
                            {translate('CreateHardwareWallet.app', {
                                app: this.state.blockchain
                            })}
                        </Text>
                        <Button
                            testID="button-next"
                            style={props.styles.bottomButton}
                            onPress={async () => {
                                this.passwordModal.requestPassword().then(() => {
                                    this.props.openBottomSheet(BottomSheetType.LEDGER_CONNECT, {
                                        blockchain: this.state.blockchain,
                                        deviceModel: this.state.device,
                                        connectionType: this.state.connection
                                    });
                                });
                            }}
                        >
                            {translate('App.labels.connect')}
                        </Button>
                    </View>
                )}
                <PasswordModal
                    shouldCreatePassword={true}
                    subtitle={translate('Password.subtitleMnemonic')}
                    obRef={ref => (this.passwordModal = ref)}
                />
            </View>
        );
    }
}

export const ConnectHardwareWallet = smartConnect(ConnectHardwareWalletScreenComponent, [
    connect(
        (state: IReduxState) => ({
            tosVersion: state.app.tosVersion
        }),
        mapDispatchToProps
    ),
    withTheme(stylesProvider)
]);
