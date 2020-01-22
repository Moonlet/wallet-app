import React from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { BottomSheetHeader } from '../header/header';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator';
import { Blockchain } from '../../../core/blockchain/types';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    blockchain: Blockchain;
    onOpenStart: () => void;
    onCloseEnd: () => void;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface IReduxProps {
    reviewTransaction: boolean;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        reviewTransaction: state.screens.send.reviewTransaction
    };
};

export class LedgerMessageBottomSheetComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;

    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        this.bottomSheet.current.props.onOpenStart();
        Platform.OS !== 'web' ? this.bottomSheet.current.snapTo(1) : null;
    }

    public renderBottomSheetContent = () => {
        const { styles } = this.props;

        return (
            <View style={[styles.content, { height: this.props.snapPoints.bottomSheetHeight }]}>
                <Text key="message" style={styles.message}>
                    {this.props.reviewTransaction === true
                        ? translate('Send.reviewTransaction')
                        : translate('CreateHardwareWallet.openApp', {
                              app: this.props.blockchain
                          })}
                </Text>
                <View key="loading">
                    <LoadingIndicator />
                </View>
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
                renderHeader={() => <BottomSheetHeader obRef={this.bottomSheet} />}
                onOpenStart={this.props.onOpenStart}
                onCloseEnd={this.props.onCloseEnd}
            />
        );
    }
}

export const LedgerMessageBottomSheet = smartConnect<IExternalProps>(
    LedgerMessageBottomSheetComponent,
    [connect(mapStateToProps, null), withTheme(stylesProvider)]
);
