import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from '../../icon';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { ICON_SIZE } from '../../../styles/dimensions';
import { BottomSheetHeader } from '../header/header';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onOpenStart: () => void;
    onCloseEnd: () => void;
}

export class DashboardMenuBottomSheetComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        this.bottomSheet.current.snapTo(this.props.snapPoints.bottomSheetHeight);
    }

    public renderBottomSheetContent = () => {
        const { styles } = this.props;

        return (
            <View style={[styles.content, { height: this.props.snapPoints.bottomSheetHeight }]}>
                <TouchableOpacity style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name="archive-locker" size={ICON_SIZE} style={styles.icon} />
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
                        <Icon name="pencil" size={ICON_SIZE} style={styles.icon} />
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
                        <Icon name="flash" size={ICON_SIZE} style={styles.icon} />
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

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={this.props.snapPoints.initialSnap}
                snapPoints={[
                    this.props.snapPoints.initialSnap,
                    this.props.snapPoints.bottomSheetHeight
                ]}
                renderContent={this.renderBottomSheetContent}
                renderHeader={() => (
                    <BottomSheetHeader
                        obRef={this.bottomSheet}
                        initialSnap={this.props.snapPoints.initialSnap}
                    />
                )}
                onOpenStart={this.props.onOpenStart}
                onCloseEnd={this.props.onCloseEnd}
            />
        );
    }
}

export const DashboardMenuBottomSheet = smartConnect<IExternalProps>(
    DashboardMenuBottomSheetComponent,
    [withTheme(stylesProvider)]
);
