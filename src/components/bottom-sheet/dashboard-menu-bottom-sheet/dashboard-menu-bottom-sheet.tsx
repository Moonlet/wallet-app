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

const BOTTOM_SHEET_HEIGHT = 300;

interface IExternalProps {
    onClose: () => void;
}

export class DashboardMenuBottomSheetComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;
    public allowBottomSheetCloseEnd: boolean;

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.bottomSheet = React.createRef();
        this.allowBottomSheetCloseEnd = false;
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

    public handleOpenStart = () => {
        this.allowBottomSheetCloseEnd = true;
        return;
    };

    public handleCloseEnd = () => {
        if (!this.allowBottomSheetCloseEnd) {
            return;
        }
        this.props.onClose();
    };

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={0}
                snapPoints={[0, BOTTOM_SHEET_HEIGHT]}
                renderContent={this.renderBottomSheetContent}
                renderHeader={() => <BottomSheetHeader obRef={this.bottomSheet} />}
                onOpenStart={this.handleOpenStart}
                onCloseEnd={this.handleCloseEnd}
            />
        );
    }
}

export const DashboardMenuBottomSheet = smartConnect<IExternalProps>(
    DashboardMenuBottomSheetComponent,
    [withTheme(stylesProvider)]
);
