import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Button } from '../../library';
import { closeTransactionRequest } from '../../redux/ui/transaction-request/actions';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { signAndSendTransaction } from '../../redux/wallets/actions';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';

export interface IReduxProps {
    isVisible: boolean;
    requestId: string;
    closeTransactionRequest: typeof closeTransactionRequest;
    signAndSendTransaction: typeof signAndSendTransaction;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.transactionRequest.isVisible,
        requestId: state.ui.transactionRequest.requestId
    };
};

const mapDispatchToProps = {
    closeTransactionRequest,
    signAndSendTransaction
};

export const navigationOptions = () => ({
    title: translate('TransactionRequest.title')
});

export class TransactionRequestScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    private async confirm() {
        try {
            const password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );

            if (this.props.requestId) {
                const tx = await ConnectExtensionWeb.getRequestIdParams(this.props.requestId);

                if (tx) {
                    this.props.signAndSendTransaction(tx, password, this.props.requestId);
                } else {
                    //
                }
            }
        } catch {
            //
        }
    }

    public render() {
        const { styles } = this.props;

        if (this.props.isVisible) {
            return (
                <View style={styles.container}>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Button
                            onPress={() => this.confirm()}
                            primary
                            disabled={this.props.requestId === undefined}
                        >
                            {translate('App.labels.confirm')}
                        </Button>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }
}

export const TransactionRequestScreen = smartConnect(TransactionRequestScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
