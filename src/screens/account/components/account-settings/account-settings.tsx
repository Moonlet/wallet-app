import React from 'react';
import { View, Modal, TouchableOpacity, Linking } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../../../core/theme/with-theme';
import { IAccountState } from '../../../../redux/wallets/state';
import { Icon } from '../../../../components/icon';
import { ITheme } from '../../../../core/theme/itheme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { ViewKey } from '../view-key/view-key';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { ICON_SIZE } from '../../../../styles/dimensions';
import { PasswordModal } from '../../../../components/password-modal/password-modal';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    onDonePressed: () => any;
    account: IAccountState;
}

interface IState {
    showKeyScreen: boolean;
    showBackButton: boolean;
    title: string;
    key: string;
    showSecurityWarning: boolean;
}

export class AccountSettingsComponent extends React.Component<IProps & IExternalProps, IState> {
    public passwordModal = null;

    constructor(props: IProps & IExternalProps) {
        super(props);

        this.state = {
            showKeyScreen: false,
            showBackButton: false,
            title: translate('AccountSettings.manageAccount'),
            key: '',
            showSecurityWarning: false
        };
    }

    public revealPrivateKey = () => {
        this.passwordModal.requestPassword().then(() =>
            this.setState({
                showKeyScreen: true,
                showBackButton: true,
                title: translate('AccountSettings.revealPrivate'),
                key: this.props.account.address, // TO DO - switch to private key
                showSecurityWarning: true
            })
        );
    };
    public revealPublicKey = () => {
        this.setState({
            showKeyScreen: true,
            showBackButton: true,
            title: translate('AccountSettings.revealPublic'),
            key: this.props.account.publicKey,
            showSecurityWarning: false
        });
    };
    public viewOn = () => {
        const url = getBlockchain(this.props.account.blockchain).networks[0].explorer.getAccountUrl(
            this.props.account.address
        );
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };
    public reportIssue = () => {
        const url = 'https://moonlet.xyz/links/support';
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };

    public render() {
        const styles = this.props.styles;
        const viewOnName = getBlockchain(this.props.account.blockchain).networks[0].explorer.name;

        return (
            <Modal animationType="fade" transparent={true} visible={true}>
                <View style={styles.container}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <View style={styles.backButtonWrapper}>
                                {this.state.showKeyScreen ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showKeyScreen: false,
                                                showBackButton: false,
                                                title: translate('AccountSettings.manageAccount')
                                            });
                                        }}
                                        style={styles.backButtonContainer}
                                    >
                                        <View style={styles.backIconContainer}>
                                            <Icon
                                                name="arrow-left-1"
                                                size={ICON_SIZE}
                                                style={styles.icon}
                                            />
                                        </View>
                                        <Text style={styles.backText}>
                                            {translate('App.buttons.back')}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                            <View style={styles.titleWrapper}>
                                <Text style={styles.title}>{this.state.title}</Text>
                            </View>

                            <View style={styles.doneWrapper}>
                                <TouchableOpacity onPress={() => this.props.onDonePressed()}>
                                    <Text style={styles.doneButton}>
                                        {translate('App.buttons.done')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.showKeyScreen ? (
                            <ViewKey
                                key={this.state.key}
                                value={this.state.key}
                                showSecurityWarning={this.state.showSecurityWarning}
                            />
                        ) : (
                            <View style={styles.contentContainer}>
                                <TouchableOpacity
                                    testID="private-key"
                                    style={styles.rowContainer}
                                    onPress={this.revealPrivateKey}
                                >
                                    <View style={styles.leftIcon}>
                                        <Icon name="key" size={24} style={styles.icon} />
                                    </View>
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.revealPrivate')}
                                        </Text>
                                        <View style={styles.rightIcon}>
                                            <Icon
                                                name="arrow-right-1"
                                                size={16}
                                                style={styles.icon}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    testID="public-key"
                                    style={styles.rowContainer}
                                    onPress={this.revealPublicKey}
                                >
                                    <View style={styles.leftIcon}>
                                        <Icon name="eye" size={24} style={styles.icon} />
                                    </View>
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.revealPublic')}
                                        </Text>
                                        <View style={styles.rightIcon}>
                                            <Icon
                                                name="arrow-right-1"
                                                size={16}
                                                style={styles.icon}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    testID="view-on"
                                    style={styles.rowContainer}
                                    onPress={this.viewOn}
                                >
                                    <View style={styles.leftIcon}>
                                        <Icon name="search" size={24} style={styles.icon} />
                                    </View>
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.viewOn') + viewOnName}
                                        </Text>
                                        <View style={styles.rightIcon}>
                                            <Icon
                                                name="arrow-right-1"
                                                size={16}
                                                style={styles.icon}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    testID="report-issue"
                                    style={styles.rowContainer}
                                    onPress={this.reportIssue}
                                >
                                    <View style={styles.leftIcon}>
                                        <Icon name="bug" size={24} style={styles.icon} />
                                    </View>
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.reportIssue')}
                                        </Text>
                                        <View style={styles.rightIcon}>
                                            <Icon
                                                name="arrow-right-1"
                                                size={16}
                                                style={styles.icon}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
                <PasswordModal obRef={ref => (this.passwordModal = ref)} />
            </Modal>
        );
    }
}

export const AccountSettings = smartConnect<IExternalProps>(AccountSettingsComponent, [
    withTheme(stylesProvider)
]);
