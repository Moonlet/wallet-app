import React from 'react';
import { ScrollView, View, Switch, TouchableOpacity } from 'react-native';
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
import { HeaderLeft } from '../../components/header-left/header-left';
import { translate } from '../../core/i18n';
import { ICON_SIZE } from '../../styles/dimensions';
import { biometricAuth } from '../../core/biometric-auth/biometric-auth';

export interface IState {
    isTouchIDSupported: boolean;
}

export interface IReduxProps {
    currency: string;
    network: string;
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
    headerLeft: <HeaderLeft icon="saturn-icon" />
});

export class SettingsScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            isTouchIDSupported: false
        };

        biometricAuth
            .isSupported()
            .then(biometryType => this.setState({ isTouchIDSupported: true }))
            .catch(error => {
                // Failure code if the user's device does not have touchID or faceID enabled
                this.setState({ isTouchIDSupported: false });
            });
    }

    public backupWalletTouch = () => {
        // backup wallet
        this.props.mock();
    };
    public reportIssueTouch = () => {
        // report an issue
        this.props.mock();
    };
    public signOut = () => {
        // sign out
        this.props.mock();
    };

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        const navigation = this.props.navigation;

        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Text style={styles.textHeader}>
                        {translate('App.labels.security').toUpperCase()}
                    </Text>

                    <View style={styles.rowContainer}>
                        <Text style={styles.textRow}>{translate('Settings.pinLogin')}</Text>
                        <Switch
                            testID={'pin-login'}
                            onValueChange={() => this.props.togglePinLogin()}
                            value={this.props.pinLogin}
                            trackColor={{
                                true: this.props.theme.colors.cardBackground,
                                false: this.props.theme.colors.primary
                            }}
                            thumbColor={
                                this.props.pinLogin ? theme.colors.accent : theme.colors.primary
                            }
                        />
                    </View>

                    <View style={styles.divider} />

                    {this.state.isTouchIDSupported && (
                        <View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.textRow}>{translate('Settings.touchID')}</Text>
                                <Switch
                                    onValueChange={() => this.props.toggleTouchID()}
                                    value={this.props.touchID}
                                    trackColor={{
                                        true: this.props.theme.colors.cardBackground,
                                        false: this.props.theme.colors.primary
                                    }}
                                    thumbColor={
                                        this.props.touchID
                                            ? theme.colors.accent
                                            : theme.colors.primary
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
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        testID={'backup-wallet'}
                        style={styles.rowContainer}
                        onPress={this.backupWalletTouch}
                    >
                        <Text style={styles.textRow}>{translate('Settings.backupWallet')}</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
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
                            <Text style={styles.textRowValue}>{this.props.currency}</Text>
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
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
                        <View style={styles.rightContainer}>
                            <Text style={styles.textRowValue}>{this.props.network}</Text>
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
                        </View>
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
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
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
                        <Text style={styles.textRow}>{translate('Settings.networkOptions')}</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
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
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.rowContainer}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                    >
                        <Text style={styles.textRow}>{translate('Settings.privacyPolicy')}</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={ICON_SIZE / 2} style={styles.icon} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.rowContainer}>
                        <Text style={styles.textRow}>{translate('Settings.appVersion')}</Text>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textRowValue}>{DeviceInfo.getVersion()}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Button testID={'sign-out'} style={styles.button} onPress={this.signOut}>
                        {translate('Settings.signOut')}
                    </Button>
                </ScrollView>
            </View>
        );
    }
}

export const SettingsScreen = smartConnect(SettingsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
