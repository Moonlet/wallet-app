import React from 'react';
import { View, Platform, TouchableHighlight } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from '../../icon/icon';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { ICON_SIZE, normalize } from '../../../styles/dimensions';
import { BottomSheetHeader } from '../header/header';
import { NavigationService } from '../../../navigation/navigation-service';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { Blockchain } from '../../../core/blockchain/types';
import { getSelectedBlockchain } from '../../../redux/wallets/selectors';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { QrModalReader } from '../../qr-modal/qr-modal';
import { openTransactionRequest } from '../../../redux/ui/transaction-request/actions';
import { IconValues } from '../../icon/values';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
}

export interface IReduxProps {
    blockchain: Blockchain;
    openTransactionRequest: typeof openTransactionRequest;
}

const mapStateToProps = (state: IReduxState) => ({
    blockchain: getSelectedBlockchain(state)
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

    private transactionHistoryPress() {
        this.props.onClose();
        NavigationService.navigate('TransactonsHistory', {});
    }

    private manageAccount() {
        this.props.onClose();
        NavigationService.navigate('ManageAccount', {});
    }

    private connectExtension() {
        this.props.onClose();
        NavigationService.navigate('ConnectExtension', {});
    }

    private manageWallets() {
        this.props.onClose();
        NavigationService.navigate('Wallets', {});
    }

    public renderRow(options: {
        title: string;
        description: string;
        iconName: string;
        onPress: () => void;
    }) {
        const { styles, theme } = this.props;

        return (
            <TouchableHighlight
                testID={options.title.replace(/ /g, '-').toLowerCase()}
                onPress={() => options.onPress()}
                underlayColor={theme.colors.bottomSheetBackground}
            >
                <View style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name={options.iconName} size={ICON_SIZE} style={styles.icon} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{options.title}</Text>
                        <Text style={styles.description}>{options.description}</Text>
                    </View>
                    <Icon
                        name={IconValues.CHEVRON_RIGHT}
                        size={normalize(16)}
                        style={styles.arrowRight}
                    />
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
                    {this.renderRow({
                        title: translate('DashboardMenu.transactionHistory'),
                        description: translate('DashboardMenu.checkTransactions'),
                        iconName: IconValues.ARCHIVE_LOCKER,
                        onPress: () => this.transactionHistoryPress()
                    })}

                    {Platform.OS !== 'web' &&
                        getBlockchain(this.props.blockchain).config.ui.enableTokenManagement &&
                        this.renderRow({
                            title: translate('DashboardMenu.manageAccount'),
                            description: translate('DashboardMenu.quicklyManage'),
                            iconName: IconValues.PENCIL,
                            onPress: () => this.manageAccount()
                        })}

                    {Platform.OS !== 'web' &&
                        this.renderRow({
                            title: translate('DashboardMenu.connectExtension'),
                            description: translate('DashboardMenu.scanCode'),
                            iconName: IconValues.QR_CODE_SCAN,
                            onPress: () => this.connectExtension()
                        })}

                    {Platform.OS !== 'web' &&
                        this.renderRow({
                            title: translate('DashboardMenu.scanPay'),
                            description: translate('DashboardMenu.scanReceive'),
                            iconName: IconValues.QR_CODE_SCAN,
                            onPress: () => this.qrCodeScanner.open()
                        })}

                    {this.renderRow({
                        title: translate('Wallets.manageWallets'),
                        description: translate('DashboardMenu.switchWallets'),
                        iconName: IconValues.MONEY_WALLET,
                        onPress: () => this.manageWallets()
                    })}
                </ScrollView>

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
