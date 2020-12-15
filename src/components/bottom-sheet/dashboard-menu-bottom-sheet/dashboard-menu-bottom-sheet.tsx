import React from 'react';
import { View, Platform, TouchableHighlight, ScrollView, Clipboard } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from '../../icon/icon';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { normalize } from '../../../styles/dimensions';
import { BottomSheetHeader } from '../header/header';
import { NavigationService } from '../../../navigation/navigation-service';
import { Blockchain } from '../../../core/blockchain/types';
import {
    generateAccountConfig,
    getSelectedAccount,
    getSelectedBlockchain,
    getSelectedWallet
} from '../../../redux/wallets/selectors';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { QrModalReader } from '../../qr-modal/qr-modal';
import { openTransactionRequest } from '../../../redux/ui/transaction-request/actions';
import { IconValues } from '../../icon/values';
import { IAccountState, IWalletState } from '../../../redux/wallets/state';
import { isFeatureActive, RemoteFeature } from '../../../core/utils/remote-feature-config';
import { Dialog } from '../../dialog/dialog';
import {
    addAccount,
    getBalance,
    setSelectedAccount
} from '../../../redux/wallets/actions/wallet-actions';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
}

interface IReduxProps {
    blockchain: Blockchain;
    openTransactionRequest: typeof openTransactionRequest;
    selectedAccount: IAccountState;
    selectedWallet: IWalletState;
    addAccount: typeof addAccount;
    setSelectedAccount: typeof setSelectedAccount;
    getBalance: typeof getBalance;
}

const mapStateToProps = (state: IReduxState) => ({
    blockchain: getSelectedBlockchain(state),
    selectedAccount: getSelectedAccount(state),
    selectedWallet: getSelectedWallet(state)
});

const mapDispatchToProps = {
    openTransactionRequest,
    addAccount,
    setSelectedAccount,
    getBalance
};

export class DashboardMenuBottomSheetComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;
    public qrCodeScanner: any;

    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        Platform.OS !== 'web' && this.bottomSheet.current.snapTo(1);
    }

    private addToken() {
        this.props.onClose();
        NavigationService.navigate('AddToken', {});
    }

    private connectedWebsites() {
        this.props.onClose();
        NavigationService.navigate('ConnectedWebsites', {});
    }

    private copyToClipboard() {
        this.props.onClose();
        Clipboard.setString(this.props.selectedAccount.address);
    }

    public renderRow(options: {
        title: string;
        subtitle?: string;
        iconName: string;
        onPress?: () => void;
        disabled?: boolean;
        hideArrow?: boolean;
    }) {
        const { styles, theme } = this.props;

        return (
            <TouchableHighlight
                testID={options.title.replace(/ /g, '-').toLowerCase()}
                onPress={() => options.onPress()}
                underlayColor={theme.colors.bottomSheetBackground}
                disabled={options.disabled}
            >
                <View style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name={options.iconName}
                            size={normalize(20)}
                            style={[
                                styles.icon,
                                {
                                    color: options.disabled
                                        ? theme.colors.textTertiary
                                        : theme.colors.accent
                                }
                            ]}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: options.disabled
                                        ? theme.colors.textTertiary
                                        : theme.colors.text
                                }
                            ]}
                        >
                            {options.title}
                        </Text>
                        {options.subtitle && (
                            <Text
                                style={[
                                    styles.subtitle,
                                    {
                                        color: theme.colors.textTertiary
                                    }
                                ]}
                            >
                                {options.subtitle}
                            </Text>
                        )}
                    </View>
                    {!options.hideArrow && (
                        <Icon
                            name={IconValues.CHEVRON_RIGHT}
                            size={normalize(16)}
                            style={[
                                styles.arrowRight,
                                {
                                    color: options.disabled
                                        ? theme.colors.textTertiary
                                        : theme.colors.accent
                                }
                            ]}
                        />
                    )}
                </View>
            </TouchableHighlight>
        );
    }

    public renderBottomSheetContent() {
        const { styles } = this.props;
        return (
            <View style={[styles.content, { height: this.props.snapPoints.bottomSheetHeight }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollArea}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    {Platform.OS !== 'web' &&
                        this.renderRow({
                            title: translate('DashboardMenu.tokenSwap'),
                            iconName: IconValues.CLAIM_REWARD,
                            disabled: true
                        })}

                    {Platform.OS !== 'web' &&
                        this.renderRow({
                            title: translate('App.labels.addToken'),
                            iconName: IconValues.CLAIM_REWARD,
                            onPress: () => this.addToken()
                        })}

                    {/* TODO: move this - implement smart scan */}
                    {Platform.OS !== 'web' &&
                        this.renderRow({
                            title: translate('DashboardMenu.scanPay'),
                            iconName: IconValues.QR_CODE_SCAN,
                            onPress: () => this.qrCodeScanner.open()
                        })}

                    {Platform.OS === 'web' &&
                        this.renderRow({
                            title: translate('DashboardMenu.connectedWebsites'),
                            iconName: IconValues.FLASH_OFF,
                            onPress: () => this.connectedWebsites()
                        })}
                    {this.renderRow({
                        title: translate('DashboardMenu.copyToClipboard'),
                        subtitle: this.props.selectedAccount.address,
                        iconName: IconValues.NOTES_LIST,
                        onPress: () => this.copyToClipboard(),
                        hideArrow: true
                    })}

                    {/*
                     * Watch Account - Dev Tools feature
                     */}
                    {isFeatureActive(RemoteFeature.DEV_TOOLS) &&
                        this.renderRow({
                            title: translate('App.labels.watchAccount'),
                            iconName: IconValues.EYE,
                            onPress: async () => {
                                const { blockchain, selectedAccount, selectedWallet } = this.props;

                                const inputValue: string = await Dialog.prompt(
                                    translate('App.labels.watchAccount'),
                                    translate('Account.watchAccount'),
                                    translate('App.labels.cancel'),
                                    translate('App.labels.add')
                                );

                                if (inputValue && inputValue !== '') {
                                    const account = generateAccountConfig(blockchain);
                                    account.address = inputValue;
                                    account.publicKey = selectedAccount.publicKey;

                                    // Maybe in future find a better way to handle index
                                    account.index = selectedWallet.accounts.filter(
                                        a => a.blockchain === blockchain
                                    ).length;

                                    this.props.addAccount(selectedWallet.id, blockchain, account);

                                    this.props.setSelectedAccount(account);

                                    this.props.getBalance(
                                        blockchain,
                                        account.address,
                                        undefined,
                                        true
                                    );

                                    this.props.onClose();
                                }
                            },
                            hideArrow: true
                        })}
                </ScrollView>

                {/* TODO: move this - implement smart scan */}
                <QrModalReader
                    obRef={ref => (this.qrCodeScanner = ref)}
                    onQrCodeScanned={value => {
                        this.props.onClose();
                        this.props.openTransactionRequest({ qrCode: value });
                    }}
                />
            </View>
        );
    }

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={0}
                snapPoints={[
                    this.props.snapPoints.initialSnap,
                    this.props.snapPoints.bottomSheetHeight
                ]}
                renderContent={() => this.renderBottomSheetContent()}
                renderHeader={() => (
                    <BottomSheetHeader
                        obRef={this.bottomSheet}
                        onClose={() => this.props.onClose()}
                    />
                )}
                enabledInnerScrolling={false}
                enabledContentTapInteraction={false}
                onCloseEnd={() => this.props.onClose()}
            />
        );
    }
}

export const DashboardMenuBottomSheet = smartConnect<IExternalProps>(
    DashboardMenuBottomSheetComponent,
    [connect(mapStateToProps, mapDispatchToProps), withTheme(stylesProvider)]
);
