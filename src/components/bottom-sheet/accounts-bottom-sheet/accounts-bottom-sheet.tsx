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

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
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

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={0}
                snapPoints={[0, BOTTOM_SHEET_HEIGHT]}
                renderContent={this.renderBottomSheetContent}
                renderHeader={() => <BottomSheetHeader obRef={this.bottomSheet} />}
                onCloseStart={() => setTimeout(() => this.props.onClose(), 500)} // TODO: fix here, onCloseEnd it's not working properly
            />
        );
    }
}

export const AccountsBottomSheet = smartConnect<IExternalProps>(AccountsBottomSheetComponent, [
    withTheme(stylesProvider)
]);
