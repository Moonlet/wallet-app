import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { AccountsScreen } from '../../accounts/accounts';
import { Icon } from '../../../components/icon';

const BOTTOM_SHEET_HEIGHT = 600;

interface IProps {
    onClose: () => void;
}

export class AccountsBottomSheetComponent extends React.Component<
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

    public renderBottomSheetContent = () => (
        <View style={{ height: BOTTOM_SHEET_HEIGHT }}>
            <AccountsScreen />
        </View>
    );

    public renderHeader = () => (
        <View style={this.props.styles.header}>
            <Icon name="arrow-button-down" size={28} style={this.props.styles.icon} />
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

export const AccountsBottomSheet = smartConnect<IProps>(AccountsBottomSheetComponent, [
    withTheme(stylesProvider)
]);
