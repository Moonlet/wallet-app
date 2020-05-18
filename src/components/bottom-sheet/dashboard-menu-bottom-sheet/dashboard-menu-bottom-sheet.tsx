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
import { ScrollView } from 'react-native-gesture-handler';
import bind from 'bind-decorator';

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

    @bind
    public transactionHistoryPress() {
        this.props.onClose();
        NavigationService.navigate('TransactonsHistory', {});
    }

    @bind
    public manageAccount() {
        this.props.onClose();
        NavigationService.navigate('ManageAccount', {});
    }

    @bind
    public connectExtension() {
        this.props.onClose();
        NavigationService.navigate('ConnectExtension', {});
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
                    <Icon name="chevron-right" size={normalize(16)} style={styles.arrowRight} />
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
                        iconName: 'archive-locker',
                        onPress: this.transactionHistoryPress
                    })}
                    {Platform.OS !== 'web' &&
                        getBlockchain(this.props.blockchain).config.ui.enableTokenManagement &&
                        this.renderRow({
                            title: translate('DashboardMenu.manageAccount'),
                            description: translate('DashboardMenu.quicklyManage'),
                            iconName: 'pencil',
                            onPress: this.manageAccount
                        })}
                    {Platform.OS !== 'web' &&
                        this.renderRow({
                            title: translate('DashboardMenu.connectExtension'),
                            description: translate('DashboardMenu.scanCode'),
                            iconName: 'qr-code-scan',
                            onPress: this.connectExtension
                        })}
                </ScrollView>
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
