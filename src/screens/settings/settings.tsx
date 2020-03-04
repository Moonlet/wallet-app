import React from 'react';
import { ScrollView, View, Switch, TouchableOpacity, Platform, Clipboard } from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { Text, Button } from '../../library';
import { IReduxState } from '../../redux/state';
import { toggleTouchID } from '../../redux/preferences/actions';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { translate } from '../../core/i18n';
import { biometricAuth, BiometryType } from '../../core/biometric-auth/biometric-auth';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { WalletConnectWeb } from '../../core/wallet-connect/wallet-connect-web';
import { Dialog } from '../../components/dialog/dialog';
import { changePIN } from '../../redux/wallets/actions';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';
import { DebugModal } from '../../components/debug-modal/debug-modal';

export interface IState {
    isTouchIDSupported: boolean;
    biometryType: BiometryType;
    changePIN: boolean;
}

export interface IReduxProps {
    currency: string;
    touchID: boolean;
    toggleTouchID: typeof toggleTouchID;
    mock: () => void;
    changePIN: typeof changePIN;
}

export const mockFunction = () => {
    return { type: 'dummy' };
};

const mapStateToProps = (state: IReduxState) => ({
    touchID: state.preferences.touchID,
    currency: state.preferences.currency
});

const mapDispatchToProps = {
    mock: mockFunction,
    toggleTouchID,
    changePIN
};

const navigationOptions = () => ({
    title: translate('App.labels.settings'),
    headerLeft: <HeaderIcon />
});

export class SettingsScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal = null;
    debugModal: any;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            isTouchIDSupported: false,
            biometryType: undefined,
            changePIN: false
        };

        biometricAuth
            .isSupported()
            .then(biometryType => {
                // biometryType on Android is of type boolean
                // biometryType on iOS is of type 'FaceID' | 'TouchID'

                if (Platform.OS === 'ios') {
                    this.setState({ biometryType });
                }
                this.setState({ isTouchIDSupported: true });
            })
            .catch(() => {
                // Failure code if the user's device does not have touchID or faceID enabled
                this.setState({ isTouchIDSupported: false });
            });
    }

    public reportIssueTouch = () => {
        // report an issue
        this.props.mock();
    };

    public renderSecuritySection = () => {
        const { styles, navigation, theme } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>
                    {translate('App.labels.security').toUpperCase()}
                </Text>

                {this.state.isTouchIDSupported && (
                    <View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.textRow}>
                                {Platform.OS === 'ios'
                                    ? translate(`BiometryType.${this.state.biometryType}`)
                                    : translate('BiometryType.FingerprintLogin')}
                            </Text>
                            <Switch
                                onValueChange={() =>
                                    this.passwordModal
                                        .requestPassword()
                                        .then(() => this.props.toggleTouchID())
                                }
                                value={this.props.touchID}
                                trackColor={{
                                    true: this.props.theme.colors.cardBackground,
                                    false: this.props.theme.colors.cardBackground
                                }}
                                thumbColor={
                                    this.props.touchID
                                        ? theme.colors.accent
                                        : theme.colors.textTertiary
                                }
                            />
                        </View>

                        <View style={styles.divider} />
                    </View>
                )}

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => navigation.navigate('Wallets')}
                >
                    <Text style={styles.textRow}>{translate('Settings.manageWallet')}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => navigation.navigate('BackupWallet')}
                >
                    <Text style={styles.textRow}>{translate('Settings.backupWallet')}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() =>
                        this.setState({ changePIN: true }, () => {
                            this.passwordModal
                                .requestPassword()
                                .then((pass: { newPassword: string; oldPassword: string }) => {
                                    this.props.changePIN(pass.newPassword, pass.oldPassword);

                                    // disable changePIN if you want to reattempt to change the PIN code
                                    this.setState({ changePIN: false }, () =>
                                        Dialog.info(
                                            translate('App.labels.success'),
                                            translate('Settings.successChangePin')
                                        )
                                    );
                                });
                        })
                    }
                >
                    <Text style={styles.textRow}>{translate('Settings.changePin')}</Text>
                    <Icon name="chevron-right" size={16} style={styles.icon} />
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
        );
    };

    public renderSetupSection = () => {
        const { styles, navigation } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>{translate('App.labels.setup').toUpperCase()}</Text>

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => navigation.navigate('SetCurrency')}
                >
                    <Text style={styles.textRow}>{translate('Settings.defaultCurrency')}</Text>
                    <View style={styles.rightContainer}>
                        <Text style={styles.rightValue}>{this.props.currency}</Text>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => navigation.navigate('BlockchainPortfolio')}
                >
                    <Text style={styles.textRow}>{translate('Settings.blockchainPortfolio')}</Text>
                    <Icon name="chevron-right" size={16} style={styles.icon} />
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
        );
    };

    public renderSupportSection = () => {
        const { styles } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>
                    {translate('App.labels.support').toUpperCase()}
                </Text>

                <TouchableOpacity
                    testID={'report-issue'}
                    style={styles.rowContainer}
                    onPress={this.reportIssueTouch}
                >
                    <Text style={styles.textRow}>{translate('Settings.reportIssue')}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
        );
    };

    public renderToolsSection = () => {
        const { styles, navigation } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>{translate('App.labels.tools').toUpperCase()}</Text>

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => navigation.navigate('NetworkOptions')}
                >
                    <Text style={styles.textRow}>{translate('Settings.mainnetTestnet')}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
        );
    };

    public renderAboutSection = () => {
        const { styles, navigation } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>{translate('App.labels.about').toUpperCase()}</Text>

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => navigation.navigate('TermsConditions')}
                >
                    <Text style={styles.textRow}>{translate('App.labels.tc')}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                >
                    <Text style={styles.textRow}>{translate('Settings.privacyPolicy')}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.rowContainer}>
                    <Text style={styles.textRow}>{translate('Settings.appVersion')}</Text>
                    <View style={styles.rightContainer}>
                        <Text style={styles.rightValue}>{DeviceInfo.getVersion()}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.colContainer}
                    onPress={() => {
                        Clipboard.setString(DeviceInfo.getUniqueId());
                        Dialog.info(translate('App.labels.success'), translate('Settings.copied'));
                    }}
                >
                    <Text style={[styles.textRow, styles.textRowMargin]}>
                        {translate('Settings.deviceId')}
                    </Text>
                    <Text style={styles.rightValue}>{DeviceInfo.getUniqueId()}</Text>
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
        );
    };

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    {Platform.OS !== 'web' && this.renderSecuritySection()}
                    {Platform.OS !== 'web' && this.renderSetupSection()}
                    {this.renderSupportSection()}
                    {Platform.OS !== 'web' && this.renderToolsSection()}
                    {this.renderAboutSection()}
                    {isFeatureActive(RemoteFeature.DEV_TOOLS) && (
                        <TouchableOpacity
                            style={styles.rowContainer}
                            onPress={() => {
                                this.debugModal.showDebug();
                            }}
                        >
                            <Text style={styles.textRow}>Debug Info</Text>
                            <View style={styles.rightContainer}>
                                <Icon name="chevron-right" size={16} style={styles.icon} />
                            </View>
                        </TouchableOpacity>
                    )}
                    {Platform.OS === 'web' && (
                        <Button
                            style={styles.button}
                            onPress={() => {
                                WalletConnectWeb.disconnect();
                                location.reload();
                            }}
                        >
                            {translate('App.labels.disconnect')}
                        </Button>
                    )}
                </ScrollView>

                <PasswordModal
                    obRef={ref => (this.passwordModal = ref)}
                    changePIN={this.state.changePIN}
                />
                <DebugModal obRef={ref => (this.debugModal = ref)} />
            </View>
        );
    }
}

export const SettingsScreen = smartConnect(SettingsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
