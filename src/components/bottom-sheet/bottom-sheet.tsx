import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { IReduxState } from '../../redux/state';
import { AccountsBottomSheet } from './accounts-bottom-sheet/accounts-bottom-sheet';
import { BottomSheetType, IBottomSheet } from '../../redux/app/state';
import { openBottomSheet, closeBottomSheet } from '../../redux/app/actions';
import { DashboardMenuBottomSheet } from './dashboard-menu-bottom-sheet/dashboard-menu-bottom-sheet';

interface IProps {
    navigator: any;
}

interface IReduxProps {
    bottomSheet: IBottomSheet;
    openBottomSheet: typeof openBottomSheet;
    closeBottomSheet: typeof closeBottomSheet;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        bottomSheet: state.app.bottomSheet
    };
};

const mapDispatchToProps = {
    openBottomSheet,
    closeBottomSheet
};

export class BottomSheetComponent extends React.Component<
    IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public allowBottomSheetCloseEnd: boolean;

    constructor(props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.allowBottomSheetCloseEnd = false;
    }

    public handleOpenStart = () => {
        this.allowBottomSheetCloseEnd = true;
        return;
    };

    public handleCloseEnd = () => {
        if (!this.allowBottomSheetCloseEnd) {
            return;
        }
        this.props.closeBottomSheet();
        this.allowBottomSheetCloseEnd = false; // reset
    };

    public render() {
        switch (this.props.bottomSheet?.type) {
            case BottomSheetType.ACCOUNTS:
                return (
                    <View style={this.props.styles.container}>
                        <AccountsBottomSheet
                            snapPoints={{ initialSnap: 0, bottomSheetHeight: 600 }}
                            onOpenStart={this.handleOpenStart}
                            onCloseEnd={this.handleCloseEnd}
                        />
                    </View>
                );

            case BottomSheetType.DASHBOARD_MENU:
                return (
                    <View style={this.props.styles.container}>
                        <DashboardMenuBottomSheet
                            snapPoints={{ initialSnap: 0, bottomSheetHeight: 300 }}
                            onOpenStart={this.handleOpenStart}
                            onCloseEnd={this.handleCloseEnd}
                            navigation={this.props.navigator?._navigation}
                        />
                    </View>
                );

            default:
                return <View />;
        }
    }
}

export const BottomSheet = smartConnect<IProps>(BottomSheetComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
