import React from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { BottomSheetHeader } from '../header/header';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator';
import {
    Blockchain,
    TransactionMessageText,
    TransactionMessageType
} from '../../../core/blockchain/types';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    blockchain: Blockchain;
    onOpenStart: () => void;
    onCloseEnd: () => void;
}

interface IReduxProps {
    sendTransactionMessage: { message: TransactionMessageText; type: TransactionMessageType };
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        sendTransactionMessage: state.ui.screens.send.message
    };
};

export class SendTransactionBottomSheetComponent extends React.Component<
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
                {this.props.sendTransactionMessage !== undefined && (
                    <Text
                        key="message"
                        style={[
                            styles.message,
                            this.props.sendTransactionMessage.type === TransactionMessageType.ERROR
                                ? styles.messageError
                                : null,
                            this.props.sendTransactionMessage.type ===
                            TransactionMessageType.WARNING
                                ? styles.messageWarning
                                : null
                        ]}
                    >
                        {translate('Send.' + this.props.sendTransactionMessage.message, {
                            app: this.props.blockchain
                        })}
                    </Text>
                )}

                {this.props.sendTransactionMessage !== undefined &&
                    this.props.sendTransactionMessage.type === TransactionMessageType.INFO && (
                        <View key="loading">
                            <LoadingIndicator />
                        </View>
                    )}
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

export const SendTransactionBottomSheet = smartConnect<IExternalProps>(
    SendTransactionBottomSheetComponent,
    [connect(mapStateToProps, null), withTheme(stylesProvider)]
);
