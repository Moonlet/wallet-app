import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IAccountState, IWalletState } from '../../../../redux/wallets/state';
import { Icon } from '../../../../components/icon/icon';
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
import { ViewKey, KeyType } from './components/view-key/view-key';
import CONFIG from '../../../../config';
import { openURL } from '../../../../core/utils/linking-handler';
import { IconValues } from '../../../../components/icon/values';

export interface IExternalProps {
    onDonePressed: () => any;
    account: IAccountState;
    wallet: IWalletState;
    chainId: ChainIdType;
    visible: boolean;
}

interface IState {
    showKeyScreen: boolean;
    showBackButton: boolean;
    title: string;
    key: string;
    showSecurityWarning: boolean;
    isLoading: boolean;
    displayOtherModal: boolean;
    keyType: KeyType;
}

export class AccountSettingsModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            showKeyScreen: false,
            showBackButton: false,
            title: translate('AccountSettings.manageAccount'),
            key: '',
            showSecurityWarning: false,
            isLoading: false,
            displayOtherModal: false,
            keyType: undefined
        };
    }

    private revealPrivateKey() {
        try {
            this.setState({ displayOtherModal: true }, async () => {
                const password = await PasswordModal.getPassword();

                this.setState({ showKeyScreen: true, isLoading: true, displayOtherModal: false });

                const hdWallet = await WalletFactory.get(
                    this.props.wallet.id,
                    this.props.wallet.type,
                    { pass: password }
                );

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
                    isLoading: false,
                    keyType: KeyType.private
                });
            });
        } catch (err) {
            //
        }
    }

    private revealPublicKey() {
        this.setState({
            showKeyScreen: true,
            showBackButton: true,
            title: translate('AccountSettings.revealPublic'),
            key: this.props.account.publicKey,
            showSecurityWarning: false,
            keyType: KeyType.public
        });
    }

    private viewOn() {
        const url = getBlockchain(this.props.account.blockchain)
            .networks.filter(n => n.chainId === this.props.chainId)[0]
            .explorer.getAccountUrl(this.props.account.address);

        openURL(url);
    }

    private reportIssue() {
        openURL(CONFIG.supportUrl);
    }

    private closeModal() {
        this.props.onDonePressed();
        this.setState({
            showKeyScreen: false,
            showBackButton: false
        });
    }

    public render() {
        const styles = this.props.styles;
        const viewOnName = getBlockchain(this.props.account.blockchain).networks[0].explorer.name;

        if (this.props.visible && !this.state.displayOtherModal) {
            return (
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
                                            name={IconValues.ARROW_LEFT_1}
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
                                <TouchableOpacity onPress={() => this.closeModal()}>
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
                                    keyType={this.state.keyType}
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
                                        <Icon
                                            name={IconValues.KEY}
                                            size={ICON_SIZE}
                                            style={styles.leftIcon}
                                        />
                                        <View style={styles.rowChild}>
                                            <Text style={styles.textRow}>
                                                {translate('AccountSettings.revealPrivate')}
                                            </Text>
                                            <Icon
                                                name={IconValues.CHEVRON_RIGHT}
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
                                    <Icon
                                        name={IconValues.EYE}
                                        size={ICON_SIZE}
                                        style={styles.leftIcon}
                                    />
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.revealPublic')}
                                        </Text>
                                        <Icon
                                            name={IconValues.CHEVRON_RIGHT}
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
                                    <Icon
                                        name={IconValues.SEARCH}
                                        size={ICON_SIZE}
                                        style={styles.leftIcon}
                                    />
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.viewOn') + viewOnName}
                                        </Text>
                                        <Icon
                                            name={IconValues.CHEVRON_RIGHT}
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
                                    <Icon
                                        name={IconValues.BUG}
                                        size={ICON_SIZE}
                                        style={styles.leftIcon}
                                    />
                                    <View style={styles.rowChild}>
                                        <Text style={styles.textRow}>
                                            {translate('AccountSettings.reportIssue')}
                                        </Text>
                                        <Icon
                                            name={IconValues.CHEVRON_RIGHT}
                                            size={normalize(16)}
                                            style={styles.rightIcon}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }
}

export const AccountSettingsModal = smartConnect<IExternalProps>(AccountSettingsModalComponent, [
    withTheme(stylesProvider)
]);
