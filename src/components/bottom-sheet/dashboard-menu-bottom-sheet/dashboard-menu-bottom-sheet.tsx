import React from 'react';
import { View, Platform, TouchableHighlight } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from '../../icon';
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

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
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

    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        Platform.OS !== 'web' && this.bottomSheet.current.snapTo(1);
    }

    public transactionHistoryPress() {
        this.props.onClose();
        NavigationService.navigate('TransactonsHistory', {});
    }

    public manageAccount() {
        this.props.onClose();
        NavigationService.navigate('ManageAccount', {});
    }

    public connectExtension() {
        this.props.onClose();
        NavigationService.navigate('ConnectExtension', {});
    }

    public renderBottomSheetContent() {
        const { styles, theme } = this.props;
        return (
            <View style={[styles.content, { height: this.props.snapPoints.bottomSheetHeight }]}>
                <TouchableHighlight
                    onPress={() => this.transactionHistoryPress()}
                    underlayColor={theme.colors.bottomSheetBackground}
                >
                    <View style={styles.rowContainer}>
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
                        <Icon name="chevron-right" size={normalize(16)} style={styles.arrowRight} />
                    </View>
                </TouchableHighlight>

                {getBlockchain(this.props.blockchain).config.ui.enableTokenManagement &&
                    Platform.OS !== 'web' && (
                        <TouchableHighlight
                            onPress={() => this.manageAccount()}
                            underlayColor={theme.colors.bottomSheetBackground}
                        >
                            <View style={styles.rowContainer}>
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
                                <Icon
                                    name="chevron-right"
                                    size={normalize(16)}
                                    style={styles.arrowRight}
                                />
                            </View>
                        </TouchableHighlight>
                    )}

                <TouchableHighlight
                    onPress={() => this.connectExtension()}
                    underlayColor={theme.colors.bottomSheetBackground}
                >
                    <View style={styles.rowContainer}>
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
                        <Icon name="chevron-right" size={normalize(16)} style={styles.arrowRight} />
                    </View>
                </TouchableHighlight>
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
    [connect(mapStateToProps, null), withTheme(stylesProvider)]
);
