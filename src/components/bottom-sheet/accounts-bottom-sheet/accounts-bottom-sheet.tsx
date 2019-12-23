import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { AccountsScreen } from '../../../screens/accounts/accounts';
import { BottomSheetHeader } from '../header/header';

const BOTTOM_SHEET_HEIGHT = 600;

interface IExternalProps {
    onClose: () => void;
}

export class AccountsBottomSheetComponent extends React.Component<
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

    public renderBottomSheetContent = () => (
        <View style={{ height: BOTTOM_SHEET_HEIGHT }}>
            <AccountsScreen />
        </View>
    );

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

export const AccountsBottomSheet = smartConnect<IExternalProps>(AccountsBottomSheetComponent, [
    withTheme(stylesProvider)
]);
