import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from '../../../components/icon';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';

const BOTTOM_SHEET_HEIGHT = 300;

interface IProps {
    onClose: () => void;
}

export class DashboardMenuBottomSheetComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;

    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        this.bottomSheet.current.snapTo(BOTTOM_SHEET_HEIGHT);
    }

    public renderBottomSheetContent = () => {
        const { styles } = this.props;

        return (
            <View style={[styles.content, { height: BOTTOM_SHEET_HEIGHT }]}>
                <TouchableOpacity style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name="money-wallet-1" size={28} style={styles.icon} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {translate('DashboardMenu.transactionHistory')}
                        </Text>
                        <Text style={styles.description}>
                            {translate('DashboardMenu.description')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name="money-wallet-1" size={28} style={styles.icon} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{translate('DashboardMenu.manageAccount')}</Text>
                        <Text style={styles.description}>
                            {translate('DashboardMenu.description')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name="money-wallet-1" size={28} style={styles.icon} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{translate('DashboardMenu.walletConnect')}</Text>
                        <Text style={styles.description}>
                            {translate('DashboardMenu.description')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    public renderHeader = () => (
        <View style={this.props.styles.header}>
            <View style={this.props.styles.panelHandle} />
        </View>
    );

    public render() {
        return (
            <View style={this.props.styles.container}>
                <BottomSheet
                    ref={this.bottomSheet}
                    initialSnap={0}
                    snapPoints={[0, BOTTOM_SHEET_HEIGHT]}
                    renderContent={this.renderBottomSheetContent}
                    renderHeader={this.renderHeader}
                    onCloseStart={() => setTimeout(() => this.props.onClose(), 500)} // TODO: fix here, onCloseEnd it's not working properly
                />
            </View>
        );
    }
}

export const DashboardMenuBottomSheet = smartConnect<IProps>(DashboardMenuBottomSheetComponent, [
    withTheme(stylesProvider)
]);
