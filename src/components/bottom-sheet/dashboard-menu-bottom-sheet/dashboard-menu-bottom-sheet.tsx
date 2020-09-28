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
import { getSelectedAccount, getSelectedBlockchain } from '../../../redux/wallets/selectors';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { QrModalReader } from '../../qr-modal/qr-modal';
import { openTransactionRequest } from '../../../redux/ui/transaction-request/actions';
import { IconValues } from '../../icon/values';
import { IAccountState } from '../../../redux/wallets/state';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
}

export interface IReduxProps {
    blockchain: Blockchain;
    openTransactionRequest: typeof openTransactionRequest;
    selectedAccount: IAccountState;
}

const mapStateToProps = (state: IReduxState) => ({
    blockchain: getSelectedBlockchain(state),
    selectedAccount: getSelectedAccount(state)
});

const mapDispatchToProps = {
    openTransactionRequest
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
