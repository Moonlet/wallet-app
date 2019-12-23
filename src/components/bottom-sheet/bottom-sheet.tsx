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
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        switch (this.props.bottomSheet?.type) {
            case BottomSheetType.ACCOUNTS:
                return (
                    <View style={this.props.styles.container}>
                        <AccountsBottomSheet onClose={() => this.props.closeBottomSheet()} />
                    </View>
                );

            case BottomSheetType.DASHBOARD_MENU:
                return (
                    <View style={this.props.styles.container}>
                        <DashboardMenuBottomSheet onClose={() => this.props.closeBottomSheet()} />
                    </View>
                );

            default:
                return <View />;
        }
    }
}

export const BottomSheet = smartConnect(BottomSheetComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
