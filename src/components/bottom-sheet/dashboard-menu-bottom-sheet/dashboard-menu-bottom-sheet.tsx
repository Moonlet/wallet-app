import React from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from '../../icon';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { ICON_SIZE } from '../../../styles/dimensions';
import { BottomSheetHeader } from '../header/header';
import { QrModalReader } from '../../qr-modal/qr-modal';
import { WalletConnectClient } from '../../../core/wallet-connect/wallet-connect-client';
import TouchableOpacity from '../../../library/touchable-opacity/touchable-opacity';
import { NavigationService } from '../../../navigation/navigation-service';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { Blockchain } from '../../../core/blockchain/types';
import { getSelectedBlockchain } from '../../../redux/wallets/selectors';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onOpenStart: () => void;
    onCloseEnd: () => void;
}

export interface IReduxProps {
    blockchain: Blockchain;
}

const mapStateToProps = (state: IReduxState) => ({
    blockchain: getSelectedBlockchain(state)
});

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
        this.bottomSheet.current.props.onOpenStart();
        Platform.OS !== 'web' ? this.bottomSheet.current.snapTo(1) : null;
    }

    public transactionHistoryPress() {
        this.props.onCloseEnd();
        NavigationService.navigate('TransactonsHistory', {});
    }

    public manageAccount() {
        this.props.onCloseEnd();
        NavigationService.navigate('ManageAccount', {});
    }

    public async onQrCodeScanned(value: string) {
        this.props.onCloseEnd();
        WalletConnectClient.connect(value);
    }

    public renderBottomSheetContent() {
        const { styles } = this.props;
        return (
            <View style={[styles.content, { height: this.props.snapPoints.bottomSheetHeight }]}>
                <TouchableOpacity
                    onPress={() => this.transactionHistoryPress()}
                    style={styles.rowContainer}
                >
                    <View style={styles.iconContainer}>
                        <Icon name="archive-locker" size={ICON_SIZE} style={styles.icon} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {translate('DashboardMenu.transactionHistory')}
                        </Text>
                        <Text style={styles.description}>
                            {translate('DashboardMenu.checkTransactions')}
                        </Text>
                    </View>
                    <Icon name="chevron-right" size={16} style={styles.arrowRight} />
                </TouchableOpacity>

                {getBlockchain(this.props.blockchain).config.ui.enableTokenManagement &&
                    Platform.OS !== 'web' && (
                        <TouchableOpacity
                            onPress={() => this.manageAccount()}
                            style={styles.rowContainer}
                        >
                            <View style={styles.iconContainer}>
                                <Icon name="pencil" size={ICON_SIZE} style={styles.icon} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>
                                    {translate('DashboardMenu.manageAccount')}
                                </Text>
                                <Text style={styles.description}>
                                    {translate('DashboardMenu.quicklyManage')}
                                </Text>
                            </View>
                            <Icon name="chevron-right" size={16} style={styles.arrowRight} />
                        </TouchableOpacity>
                    )}

                <TouchableOpacity
                    onPress={() => this.qrCodeScanner.open()}
                    style={styles.rowContainer}
                >
                    <View style={styles.iconContainer}>
                        <Icon name="qr-code-scan" size={ICON_SIZE} style={styles.icon} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {translate('DashboardMenu.connectExtension')}
                        </Text>
                        <Text style={styles.description}>
                            {translate('DashboardMenu.scanCode')}
                        </Text>
                    </View>
                    <Icon name="chevron-right" size={16} style={styles.arrowRight} />
                </TouchableOpacity>

                <QrModalReader
                    obRef={ref => (this.qrCodeScanner = ref)}
                    onQrCodeScanned={value => this.onQrCodeScanned(value)}
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
                renderHeader={() => <BottomSheetHeader obRef={this.bottomSheet} />}
                onOpenStart={this.props.onOpenStart}
                onCloseEnd={this.props.onCloseEnd}
            />
        );
    }
}

export const DashboardMenuBottomSheet = smartConnect<IExternalProps>(
    DashboardMenuBottomSheetComponent,
    [connect(mapStateToProps, null), withTheme(stylesProvider)]
);
