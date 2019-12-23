import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { AccountsScreen } from '../../../screens/accounts/accounts';
import { BottomSheetHeader } from '../header/header';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onOpenStart: () => void;
    onCloseEnd: () => void;
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
        this.bottomSheet.current.snapTo(this.props.snapPoints.bottomSheetHeight);
    }

    public renderBottomSheetContent = () => (
        <View style={{ height: this.props.snapPoints.bottomSheetHeight }}>
            <AccountsScreen />
        </View>
    );

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

export const AccountsBottomSheet = smartConnect<IExternalProps>(AccountsBottomSheetComponent, [
    withTheme(stylesProvider)
]);
