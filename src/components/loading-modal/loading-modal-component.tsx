import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { IReduxState } from '../../redux/state';
import { Text } from '../../library/text/text';
import { translate } from '../../core/i18n';
import { getSelectedBlockchain } from '../../redux/wallets/selectors';
import { Blockchain, TransactionMessageType } from '../../core/blockchain/types';
import { Deferred } from '../../core/utils/deferred';
import { ILoadingModalMessage } from './types';
import { setInstance, waitForInstance } from '../../core/utils/class-registry';
import { IconValues } from '../icon/values';
import Icon from '../icon/icon';
import { normalize } from '../../styles/dimensions';

interface IReduxProps {
    blockchain: Blockchain;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        blockchain: getSelectedBlockchain(state)
    };
};

interface IState {
    isVisible: boolean;
    message: ILoadingModalMessage;
    icon: IconValues;
}

export class LoadingModalComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private resultDeferred: Deferred;

    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        setInstance(LoadingModalComponent, this);
        this.state = {
            isVisible: false,
            message: undefined,
            icon: undefined
        };
    }

    public static async open(message?: ILoadingModalMessage) {
        return waitForInstance<LoadingModalComponent>(LoadingModalComponent).then(ref =>
            ref.open(message)
        );
    }

    public static async close() {
        return waitForInstance<LoadingModalComponent>(LoadingModalComponent).then(ref =>
            ref.close()
        );
    }

    public static async showMessage(message: ILoadingModalMessage) {
        return waitForInstance<LoadingModalComponent>(LoadingModalComponent).then(ref =>
            ref.showMessage(message)
        );
    }

    public static async showMessageWithIcon(message: ILoadingModalMessage, icon: IconValues) {
        return waitForInstance<LoadingModalComponent>(LoadingModalComponent).then(ref =>
            ref.showMessageWithIcon(message, icon)
        );
    }

    private open(message: ILoadingModalMessage) {
        this.resultDeferred = new Deferred();
        this.setState(
            {
                isVisible: true,
                message
            },
            () => this.resultDeferred?.resolve()
        );
        return this.resultDeferred.promise;
    }

    private close() {
        this.resultDeferred = new Deferred();
        this.setState(
            {
                isVisible: false,
                message: undefined,
                icon: undefined
            },
            () => this.resultDeferred?.resolve()
        );
        return this.resultDeferred.promise;
    }

    private showMessage(message: ILoadingModalMessage) {
        this.resultDeferred = new Deferred();
        this.setState(
            {
                message
            },
            () => this.resultDeferred?.resolve()
        );
        return this.resultDeferred.promise;
    }

    private showMessageWithIcon(message: ILoadingModalMessage, icon: IconValues) {
        this.resultDeferred = new Deferred();
        this.setState(
            {
                message,
                icon
            },
            () => this.resultDeferred?.resolve()
        );
        return this.resultDeferred.promise;
    }

    public render() {
        const { styles } = this.props;
        const { message } = this.state;

        let Component;

        if (message?.type === TransactionMessageType.COMPONENT) {
            Component = message.component;
        }

        const msg =
            message?.text &&
            translate('LoadingModal.' + message.text, { app: this.props.blockchain });

        if (this.state.isVisible) {
            return (
                <View style={styles.container}>
                    {this.state.icon ? (
                        <Icon name={this.state.icon} size={normalize(80)} style={styles.icon} />
                    ) : (
                        <ActivityIndicator size="large" color={this.props.theme.colors.accent} />
                    )}
                    {msg ? (
                        <Text style={styles.message}>{msg}</Text>
                    ) : message?.component ? (
                        Component
                    ) : null}
                </View>
            );
        } else {
            return null;
        }
    }
}
