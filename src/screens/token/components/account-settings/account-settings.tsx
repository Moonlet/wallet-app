import React from 'react';
import { View, TouchableOpacity, Linking, Platform, Modal } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../../../core/theme/with-theme';
import { IAccountState, IWalletState } from '../../../../redux/wallets/state';
import { Icon } from '../../../../components/icon';
import { ITheme } from '../../../../core/theme/itheme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { ICON_SIZE, normalize } from '../../../../styles/dimensions';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { WalletFactory } from '../../../../core/wallet/wallet-factory';
import { ChainIdType } from '../../../../core/blockchain/types';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import { WalletType } from '../../../../core/wallet/types';
import { ViewKey } from './components/view-key/view-key';
import CONFIG from '../../../../config';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    onDonePressed: () => any;
    account: IAccountState;
    wallet: IWalletState;
    chainId: ChainIdType;
}

interface IState {
    showKeyScreen: boolean;
    showBackButton: boolean;
    title: string;
    key: string;
    showSecurityWarning: boolean;
    isLoading: boolean;
}

export class AccountSettingsComponent extends React.Component<IProps & IExternalProps, IState> {
    constructor(props: IProps & IExternalProps) {
        super(props);

        this.state = {
            showKeyScreen: false,
            showBackButton: false,
            title: translate('AccountSettings.manageAccount'),
            key: '',
            showSecurityWarning: false,
            isLoading: false
        };
    }

    public async revealPrivateKey() {
        try {
            // TODO: not working because of modal over modal
            const password = await PasswordModal.getPassword();

            this.setState({ showKeyScreen: true, isLoading: true });

            const hdWallet = await WalletFactory.get(this.props.wallet.id, this.props.wallet.type, {
                pass: password
            });

            const privateKey = hdWallet.getPrivateKey(
                this.props.account.blockchain,
                this.props.account.index
            );

            this.setState({
                showKeyScreen: true,
                showBackButton: true,
                title: translate('AccountSettings.revealPrivate'),
                key: privateKey,
                showSecurityWarning: true,
                isLoading: false
            });
        } catch (err) {
            //
        }
    }

    public revealPublicKey() {
        this.setState({
            showKeyScreen: true,
            showBackButton: true,
            title: translate('AccountSettings.revealPublic'),
            key: this.props.account.publicKey,
            showSecurityWarning: false
        });
    }

    public viewOn() {
        const url = getBlockchain(this.props.account.blockchain)
            .networks.filter(n => n.chainId === this.props.chainId)[0]
            .explorer.getAccountUrl(this.props.account.address);
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    }

    public reportIssue() {
        Linking.canOpenURL(CONFIG.supportUrl).then(supported => {
            if (supported) {
                Linking.openURL(CONFIG.supportUrl);
            }
        });
    }

    public render() {
        const styles = this.props.styles;
        const viewOnName = getBlockchain(this.props.account.blockchain).networks[0].explorer.name;

        return (
            <Modal visible={true} transparent={true} animationType="fade">
                <View style={styles.container}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <View style={styles.backButtonWrapper}>
                                {this.state.showKeyScreen && (
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
                                        <Icon
                                            name="arrow-left-1"
                                            size={ICON_SIZE}
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                )}
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
                            this.state.isLoading ? (
                                <LoadingIndicator />
                            ) : (
                                <ViewKey
                                    key={this.state.key}
                                    value={this.state.key}
                                    showSecurityWarning={this.state.showSecurityWarning}
                                />
                            )
                        ) : (
                            <View style={styles.contentContainer}>
                                {this.props.wallet.type !== WalletType.HW && Platform.OS !== 'web' && (
                                    <TouchableOpacity
                                        testID="private-key"
                                        style={styles.rowContainer}
                                        onPress={() => this.revealPrivateKey()}
                                    >
                                        <Icon name="key" size={ICON_SIZE} style={styles.leftIcon} />
                                        <View style={styles.rowChild}>
                                            <Text style={styles.textRow}>
                                                {translate('AccountSettings.revealPrivate')}
                                            </Text>
                                            <Icon
                                                name="chevron-right"
                                                size={normalize(16)}
                                                style={styles.rightIcon}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    testID="public-key"
                                    style={styles.rowContainer}
                                    onPress={() => this.revealPublicKey()}
                                >
                                    <Icon name="eye" size={ICON_SIZE} style={styles.leftIcon} />
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.revealPublic')}
                                        </Text>
                                        <Icon
                                            name="chevron-right"
                                            size={normalize(16)}
                                            style={styles.rightIcon}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    testID="view-on"
                                    style={styles.rowContainer}
                                    onPress={() => this.viewOn()}
                                >
                                    <Icon name="search" size={ICON_SIZE} style={styles.leftIcon} />
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.viewOn') + viewOnName}
                                        </Text>
                                        <Icon
                                            name="chevron-right"
                                            size={normalize(16)}
                                            style={styles.rightIcon}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    testID="report-issue"
                                    style={styles.rowContainer}
                                    onPress={() => this.reportIssue()}
                                >
                                    <Icon name="bug" size={ICON_SIZE} style={styles.leftIcon} />
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.reportIssue')}
                                        </Text>
                                        <Icon
                                            name="chevron-right"
                                            size={normalize(16)}
                                            style={styles.rightIcon}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        );
    }
}

export const AccountSettings = smartConnect<IExternalProps>(AccountSettingsComponent, [
    withTheme(stylesProvider)
]);
