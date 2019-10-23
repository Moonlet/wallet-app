import React from 'react';
import { ScrollView, View, Switch, TouchableOpacity } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Text } from '../../library/text';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
import { Icon } from '../../components/icon';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    currency: string;
    network: string;
}

const mapStateToProps = (state: IReduxState) => ({});

export class SettingsScreenComponent extends React.Component<IProps & IReduxProps> {
    public pinLoginSwitch = () => {
        // pin login
    };
    public touchIdSwitch = () => {
        // touch Id
    };
    public revealPassphraseTouch = () => {
        // open reveal Passphrase screen
    };
    public backupWalletTouch = () => {
        // backup wallet
    };
    public manageWalletTouch = () => {
        // manage wallet
    };
    public defaultCurrencyTouch = () => {
        // set default currency
    };
    public defaultNetworkTouch = () => {
        // set default network
    };
    public developerOptionsTouch = () => {
        // developer options touch
    };
    public reportIssueTouch = () => {
        // report an issue
    };
    public termsAndConditionsTouch = () => {
        // open terms
    };

    public render() {
        const styles = this.props.styles;

        return (
            <ScrollView style={styles.container}>
                <View>
                    <View>
                        <Text style={styles.textHeader}>SECURITY</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.textRow}>Pin Login</Text>
                        <View style={styles.switch}>
                            <Switch onValueChange={this.pinLoginSwitch} value={true} />
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.rowContainer}>
                        <Text style={styles.textRow}>TouchID</Text>
                        <View style={styles.switch}>
                            <Switch onValueChange={this.touchIdSwitch} value={true} />
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        key={'secret-phrase'}
                        style={styles.rowContainer}
                        onPress={() => this.revealPassphraseTouch}
                    >
                        <Text style={styles.textRow}>Reveal secret phrase</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        key={'backup-wallet'}
                        style={styles.rowContainer}
                        onPress={() => this.backupWalletTouch}
                    >
                        <Text style={styles.textRow}>Backup your wallet</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.textHeader}>SETUP</Text>
                    </View>
                    <TouchableOpacity
                        key={'manage-wallet'}
                        style={styles.rowContainer}
                        onPress={() => this.manageWalletTouch}
                    >
                        <Text style={styles.textRow}>Manage your wallet</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        key={'default-currency'}
                        style={styles.rowContainer}
                        onPress={() => this.defaultCurrencyTouch}
                    >
                        <Text style={styles.textRow}>Default currency</Text>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textRowValue}>{this.props.currency}</Text>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        key={'default-network'}
                        style={styles.rowContainer}
                        onPress={() => this.defaultNetworkTouch}
                    >
                        <Text style={styles.textRow}>Default network</Text>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textRowValue}>{this.props.network}</Text>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.textHeader}>SUPPORT</Text>
                    </View>
                    <TouchableOpacity
                        key={'report-issue'}
                        style={styles.rowContainer}
                        onPress={() => this.reportIssueTouch}
                    >
                        <Text style={styles.textRow}>Report issue</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.textHeader}>TOOLS</Text>
                    </View>
                    <TouchableOpacity
                        key={'developer-options'}
                        style={styles.rowContainer}
                        onPress={() => this.developerOptionsTouch}
                    >
                        <Text style={styles.textRow}>Developer options</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.textHeader}>ABOUT</Text>
                    </View>
                    <TouchableOpacity
                        key={'terms-conditions'}
                        style={styles.rowContainer}
                        onPress={() => this.termsAndConditionsTouch}
                    >
                        <Text style={styles.textRow}>Terms & conditions</Text>
                        <View style={styles.rightContainer}>
                            <Icon name="arrow-right-1" size={16} style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={styles.rowContainer}>
                        <Text style={styles.textRow}>Application version</Text>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textRowValue}>{DeviceInfo.getVersion()}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export const SettingsScreen = connect(
    mapStateToProps,
    null
)(withTheme(SettingsScreenComponent, stylesProvider));
