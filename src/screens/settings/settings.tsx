import React from 'react';
import { ScrollView, View, Switch, TouchableOpacity, Platform, Clipboard } from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { Text, Button } from '../../library';
import { IReduxState } from '../../redux/state';
import { togglePinLogin, toggleTouchID } from '../../redux/preferences/actions';
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

export interface IState {
    isTouchIDSupported: boolean;
    biometryType: BiometryType;
}

export interface IReduxProps {
    currency: string;
    pinLogin: boolean;
    togglePinLogin: typeof togglePinLogin;
    touchID: boolean;
    toggleTouchID: typeof toggleTouchID;
    mock: () => void;
}

export const mockFunction = () => {
    return { type: 'dummy' };
};

const mapStateToProps = (state: IReduxState) => ({
    pinLogin: state.preferences.pinLogin,
    touchID: state.preferences.touchID,
    currency: state.preferences.currency
});

const mapDispatchToProps = {
    mock: mockFunction,
    togglePinLogin,
    toggleTouchID
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
                if (Platform.OS === 'ios') {
                    this.setState({ biometryType });
                }
                this.setState({ isTouchIDSupported: true });
            })
            .catch(error => {
                // Failure code if the user's device does not have touchID or faceID enabled
                this.setState({ isTouchIDSupported: false });
            });
    }

    public reportIssueTouch = () => {
        // report an issue
        this.props.mock();
    };
    public signOut = () => {
        if (Platform.OS === 'web') {
            WalletConnectWeb.disconnect();
            location.reload();
        }
    };

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        const navigation = this.props.navigation;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.textHeader}>
                        {translate('App.labels.security').toUpperCase()}
                    </Text>

                    <View style={styles.rowContainer}>
                        <Text style={styles.textRow}>{translate('Settings.pinLogin')}</Text>
                        <Switch
                            onValueChange={() =>
                                this.passwordModal
                                    .requestPassword()
                                    .then(() => this.props.togglePinLogin())
                            }
                            value={this.props.pinLogin}
                            trackColor={{
                                true: this.props.theme.colors.cardBackground,
                                false: this.props.theme.colors.cardBackground
                            }}
                            thumbColor={
                                this.props.pinLogin
                                    ? theme.colors.accent
                                    : theme.colors.textTertiary
                            }
                        />
                    </View>

                    <View style={styles.divider} />

                    {this.state.isTouchIDSupported && (
                        <View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.textRow}>
                                    {Platform.OS === 'ios' && this.state.biometryType
                                        ? translate(`BiometryType.${this.state.biometryType}`)
                                        : translate('BiometryType.TouchID')}
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

                    <Text style={styles.textHeader}>
                        {translate('App.labels.setup').toUpperCase()}
                    </Text>

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
                        <Text style={styles.textRow}>
                            {translate('Settings.blockchainPortfolio')}
                        </Text>
                        <Icon name="chevron-right" size={16} style={styles.icon} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

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

                    <Text style={styles.textHeader}>
                        {translate('App.labels.tools').toUpperCase()}
                    </Text>

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

                    <Text style={styles.textHeader}>
                        {translate('App.labels.about').toUpperCase()}
                    </Text>

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
                            Dialog.confirm(translate('Settings.copied'), '');
                        }}
                    >
                        <Text style={[styles.textRow, styles.textRowMargin]}>
                            {translate('Settings.deviceId')}
                        </Text>
                        <Text style={styles.rightValue}>{DeviceInfo.getUniqueId()}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {Platform.OS === 'web' && (
                        <Button style={styles.button} onPress={this.signOut}>
                            {translate('Settings.signOut')}
                        </Button>
                    )}
                </ScrollView>

                <PasswordModal obRef={ref => (this.passwordModal = ref)} />
            </View>
        );
    }
}

export const SettingsScreen = smartConnect(SettingsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
