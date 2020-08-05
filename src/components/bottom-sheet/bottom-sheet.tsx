import React from 'react';
import { View, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { IReduxState } from '../../redux/state';
import { AccountsBottomSheet } from './accounts-bottom-sheet/accounts-bottom-sheet';
import { DashboardMenuBottomSheet } from './dashboard-menu-bottom-sheet/dashboard-menu-bottom-sheet';
import { ExtensionRequestBottomSheet } from './extension-request-bottom-sheet/extension-request-bottom-sheet';
import { IBottomSheet, BottomSheetType } from '../../redux/ui/bottomSheet/state';
import { openBottomSheet, closeBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { BlockchainNavigationBottomSheet } from './blockchain-navigation-bottom-sheet/blockchain-navigation-bottom-sheet';
import { normalize } from '../../styles/dimensions';
import { LedgerConnectBottomSheet } from './ledger-connect-bottom-sheet/ledger-connect-bottom-sheet';
import { WalletsBottomSheet } from './wallets-bottom-sheet/wallets-bottom-sheet';
import bind from 'bind-decorator';

const HEIGHT_1_ROW = normalize(132);
// const HEIGHT_2_ROW = normalize(200);
const HEIGHT_3_ROWS = normalize(280);
// const HEIGHT_4_ROWS = normalize(360);
const HEIGHT_5_ROWS = normalize(420);
const HEIGHT_BLOCKCHAIN_NAVIGATION = normalize(400);
const HEIGHT_THREE_QUARTERS_SCREEN = (Dimensions.get('window').height * 3) / 4;

interface IReduxProps {
    bottomSheet: IBottomSheet;
    openBottomSheet: typeof openBottomSheet;
    closeBottomSheet: typeof closeBottomSheet;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        bottomSheet: state.ui.bottomSheet
    };
};

const mapDispatchToProps = {
    openBottomSheet,
    closeBottomSheet
};

export class BottomSheetComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    @bind
    private handleClose() {
        this.props.closeBottomSheet();
    }

    public render() {
        switch (this.props.bottomSheet?.type) {
            case BottomSheetType.ACCOUNTS:
                return (
                    <View style={this.props.styles.container}>
                        <TouchableOpacity
                            onPress={this.handleClose}
                            style={this.props.styles.container}
                            activeOpacity={1}
                        />
                        <AccountsBottomSheet
                            snapPoints={{
                                initialSnap:
                                    Platform.OS === 'web' ? HEIGHT_THREE_QUARTERS_SCREEN : 0,
                                bottomSheetHeight: HEIGHT_THREE_QUARTERS_SCREEN
                            }}
                            onClose={this.handleClose}
                        />
                    </View>
                );

            case BottomSheetType.DASHBOARD_MENU:
                return (
                    <View style={this.props.styles.container}>
                        <TouchableOpacity
                            onPress={this.handleClose}
                            style={this.props.styles.container}
                            activeOpacity={1}
                        />
                        <DashboardMenuBottomSheet
                            snapPoints={{
                                initialSnap: Platform.OS === 'web' ? HEIGHT_1_ROW : 0,
                                bottomSheetHeight: Platform.select({
                                    web: HEIGHT_1_ROW,
                                    default: HEIGHT_5_ROWS
                                })
                            }}
                            onClose={this.handleClose}
                        />
                    </View>
                );

            case BottomSheetType.LEDGER_CONNECT:
                return (
                    <View style={this.props.styles.container}>
                        <TouchableOpacity
                            onPress={this.handleClose}
                            style={this.props.styles.container}
                            activeOpacity={1}
                        />
                        <LedgerConnectBottomSheet
                            snapPoints={{ initialSnap: 0, bottomSheetHeight: normalize(300) }}
                            blockchain={this.props.bottomSheet?.blockchain}
                            deviceModel={this.props.bottomSheet?.deviceModel}
                            connectionType={this.props.bottomSheet?.connectionType}
                            onClose={this.handleClose}
                        />
                    </View>
                );

            case BottomSheetType.EXTENSION_REQUEST:
                return (
                    <View style={this.props.styles.container}>
                        <TouchableOpacity
                            onPress={this.handleClose}
                            style={this.props.styles.container}
                            activeOpacity={1}
                        />
                        <ExtensionRequestBottomSheet
                            snapPoints={{
                                initialSnap: Platform.OS === 'web' ? HEIGHT_3_ROWS : 0,
                                bottomSheetHeight: HEIGHT_3_ROWS
                            }}
                            onClose={this.handleClose}
                            data={this.props.bottomSheet?.data}
                        />
                    </View>
                );

            case BottomSheetType.BLOCKCHAIN_NAVIGATION:
                return (
                    <View style={this.props.styles.container}>
                        <TouchableOpacity
                            onPress={this.handleClose}
                            style={this.props.styles.container}
                            activeOpacity={1}
                        />
                        <BlockchainNavigationBottomSheet
                            snapPoints={{
                                initialSnap:
                                    Platform.OS === 'web' ? HEIGHT_BLOCKCHAIN_NAVIGATION : 0,
                                bottomSheetHeight: HEIGHT_BLOCKCHAIN_NAVIGATION
                            }}
                            onClose={this.handleClose}
                        />
                    </View>
                );

            case BottomSheetType.WALLETS:
                return (
                    <View style={this.props.styles.container}>
                        <TouchableOpacity
                            onPress={this.handleClose}
                            style={this.props.styles.container}
                            activeOpacity={1}
                        />
                        <WalletsBottomSheet
                            snapPoints={{
                                initialSnap:
                                    Platform.OS === 'web' ? HEIGHT_THREE_QUARTERS_SCREEN : 0,
                                bottomSheetHeight: HEIGHT_THREE_QUARTERS_SCREEN
                            }}
                            onClose={this.handleClose}
                        />
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
