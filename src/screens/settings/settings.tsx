import React from 'react';
import {
    ScrollView,
    View,
    Switch,
    TouchableOpacity,
    Platform,
    Clipboard,
    Linking
} from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { Text, Button } from '../../library';
import { IReduxState } from '../../redux/state';
import { toggleBiometricAuth } from '../../redux/preferences/actions';
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
import { Dialog } from '../../components/dialog/dialog';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';
import { DebugModal } from '../../components/debug-modal/debug-modal';
import CONFIG from '../../config';
import { setDisplayPasswordModal } from '../../redux/ui/password-modal/actions';
import { setPinCode, clearPinCode } from '../../core/secure/keychain';
import { delay } from '../../core/utils/time';
import { normalize } from '../../styles/dimensions';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { resetAllData } from '../../redux/app/actions';
import { LoadingModal } from '../../components/loading-modal/loading-modal';

export interface IState {
    isTouchIDSupported: boolean;
    biometryType: BiometryType;
}

export interface IReduxProps {
    currency: string;
    deviceId: string;
    biometricActive: boolean;
    toggleBiometricAuth: typeof toggleBiometricAuth;
    setDisplayPasswordModal: typeof setDisplayPasswordModal;
    resetAllData: typeof resetAllData;
}

const mapStateToProps = (state: IReduxState) => ({
    biometricActive: state.preferences.biometricActive,
    currency: state.preferences.currency,
    deviceId: state.preferences.deviceId
});

const mapDispatchToProps = {
    toggleBiometricAuth,
    setDisplayPasswordModal,
    resetAllData
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
    public debugModal: any;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            isTouchIDSupported: false,
            biometryType: undefined
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

    public reportIssueTouch() {
        Linking.canOpenURL(CONFIG.supportUrl).then(supported => {
            if (supported) {
                if (Platform.OS === 'web') {
                    window.open(CONFIG.supportUrl);
                } else {
                    Linking.openURL(CONFIG.supportUrl);
                }
            }
        });
    }

    private renderRow(label: string, callback: any) {
        const { styles } = this.props;

        return (
            <View>
                <TouchableOpacity style={styles.rowContainer} onPress={() => callback()}>
                    <Text style={styles.textRow}>{label}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="chevron-right" size={normalize(16)} style={styles.icon} />
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
        );
    }

    public renderSecuritySection() {
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
                                onValueChange={async () => {
                                    try {
                                        if (this.props.biometricActive) {
                                            await clearPinCode();
                                        } else {
                                            await LoadingModal.open();

                                            const password = await PasswordModal.getPassword(
                                                undefined,
                                                undefined,
                                                { showCloseButton: true }
                                            );
                                            await delay(0);
                                            await setPinCode(password);
                                        }
                                        this.props.toggleBiometricAuth();
                                    } catch {
                                        //
                                    } finally {
                                        await LoadingModal.close();
                                    }
                                }}
                                value={this.props.biometricActive}
                                trackColor={{
                                    true: this.props.theme.colors.cardBackground,
                                    false: this.props.theme.colors.cardBackground
                                }}
                                thumbColor={
                                    this.props.biometricActive
                                        ? theme.colors.accent
                                        : theme.colors.textTertiary
                                }
                            />
                        </View>

                        <View style={styles.divider} />
                    </View>
                )}

                {this.renderRow(translate('Settings.manageWallet'), () =>
                    navigation.navigate('Wallets')
                )}

                {this.renderRow(translate('Settings.backupWallet'), () =>
                    navigation.navigate('BackupWallet')
                )}

                {this.renderRow(translate('Settings.changePin'), async () => {
                    try {
                        await LoadingModal.open();
                        await PasswordModal.changePassword();
                        Dialog.info(
                            translate('App.labels.success'),
                            translate('Settings.successChangePin')
                        );
                    } catch {
                        //
                    } finally {
                        await LoadingModal.close();
                    }
                })}
            </View>
        );
    }

    public renderSetupSection() {
        const { styles, navigation } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>{translate('App.labels.setup').toUpperCase()}</Text>

                {this.renderRow(translate('Settings.defaultCurrency'), () =>
                    navigation.navigate('SetCurrency')
                )}

                {this.renderRow(translate('Settings.blockchainPortfolio'), () =>
                    navigation.navigate('BlockchainPortfolio')
                )}
            </View>
        );
    }

    public renderSupportSection() {
        const { styles } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>
                    {translate('App.labels.support').toUpperCase()}
                </Text>

                {this.renderRow(translate('Settings.reportIssue'), () => this.reportIssueTouch())}
            </View>
        );
    }

    public renderToolsSection() {
        const { styles, navigation } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>{translate('App.labels.tools').toUpperCase()}</Text>

                {this.renderRow(translate('Settings.mainnetTestnet'), () =>
                    navigation.navigate('NetworkOptions')
                )}
            </View>
        );
    }

    public renderAboutSection() {
        const { styles, navigation } = this.props;

        return (
            <View>
                <Text style={styles.textHeader}>{translate('App.labels.about').toUpperCase()}</Text>

                {this.renderRow(translate('App.labels.tc'), () =>
                    navigation.navigate('TermsConditions')
                )}

                {this.renderRow(translate('Settings.privacyPolicy'), () =>
                    navigation.navigate('PrivacyPolicy')
                )}

                <View style={styles.rowContainer}>
                    <Text style={styles.textRow}>{translate('Settings.appVersion')}</Text>
                    <View style={styles.rightContainer}>
                        <Text style={styles.rightValue}>{DeviceInfo.getReadableVersion()}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {Platform.OS !== 'web' && (
                    <View>
                        <TouchableOpacity
                            style={styles.colContainer}
                            onPress={() => {
                                Clipboard.setString(this.props.deviceId);
                                Dialog.info(
                                    translate('App.labels.success'),
                                    translate('Settings.copied')
                                );
                            }}
                        >
                            <Text style={[styles.textRow, styles.textRowMargin]}>
                                {translate('Settings.deviceId')}
                            </Text>
                            <Text style={styles.rightValue}>{this.props.deviceId}</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />
                    </View>
                )}
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
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
                                <Icon
                                    name="chevron-right"
                                    size={normalize(16)}
                                    style={styles.icon}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    {Platform.OS === 'web' && (
                        <Button
                            style={styles.button}
                            onPress={async () => {
                                await ConnectExtensionWeb.disconnect();
                                this.props.resetAllData();
                                location.reload();
                            }}
                        >
                            {translate('App.labels.disconnect')}
                        </Button>
                    )}
                </ScrollView>

                <DebugModal obRef={ref => (this.debugModal = ref)} />
            </View>
        );
    }
}

export const SettingsScreen = smartConnect(SettingsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
