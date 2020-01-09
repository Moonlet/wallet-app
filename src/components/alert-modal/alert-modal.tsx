import React from 'react';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Deferred } from '../../core/utils/deferred';
import { Text } from '../../library';
import Dialog from 'react-native-dialog';
import { translate } from '../../core/i18n';
import { KeyboardTypeOptions } from 'react-native';

export interface IAlertButton {
    text?: string;
    onPress?: (value?: string) => void;
}

export interface IExternalProps {
    obRef?: any;
}

interface IState {
    visible: boolean;

    isAlert: boolean;
    isPrompt: boolean;
    isConfirm: boolean;

    title: string;
    message: string;

    cancelButton: IAlertButton;
    confirmButton: IAlertButton;

    cancelButtonText: string;
    confirmButtonText: string;

    defaultInputValue: string;
    inputValue: string;
    keyboardType: KeyboardTypeOptions;
}

export class AlertModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public input = null;
    private showAlertDeferred = null;

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            visible: false,

            isAlert: false,
            isPrompt: false,
            isConfirm: false,

            title: '',
            message: '',

            cancelButtonText: '',
            confirmButtonText: '',

            cancelButton: undefined,
            confirmButton: undefined,

            defaultInputValue: 'Type here',
            inputValue: '',
            keyboardType: 'default'
        };
        props.obRef && props.obRef(this);
    }

    public async showAlert(
        title: string,
        message: string,
        cancelButton: IAlertButton,
        confirmButton: IAlertButton
    ): Promise<boolean> {
        this.showAlertDeferred = new Deferred();

        this.setState({
            visible: true,
            isAlert: true,
            title,
            message,
            cancelButton,
            confirmButton
        });

        return this.showAlertDeferred.promise;
    }

    public async showPrompt(
        title: string,
        message: string,
        cancelButtonText: string,
        confirmButtonText: string,
        defaultInputValue?: string,
        keyboardType?: KeyboardTypeOptions
    ): Promise<string> {
        this.showAlertDeferred = new Deferred();

        this.setState({
            isPrompt: true,
            visible: true,
            title,
            message,
            cancelButtonText,
            confirmButtonText,
            defaultInputValue,
            keyboardType
        });

        return this.showAlertDeferred.promise;
    }

    public async showConfirm(title: string, message: string): Promise<boolean> {
        this.showAlertDeferred = new Deferred();

        this.setState({
            isConfirm: true,
            visible: true,
            title,
            message
        });

        return this.showAlertDeferred.promise;
    }

    public hideAlert = () =>
        this.setState({
            visible: false,
            isAlert: false,
            cancelButton: undefined,
            confirmButton: undefined
        });

    public hidePrompt = () => this.setState({ visible: false, isPrompt: false, inputValue: '' });

    public hideConfirm = () => this.setState({ visible: false, isConfirm: false });

    public render() {
        const { styles, theme } = this.props;

        return (
            <Dialog.Container
                visible={this.state.visible}
                blurStyle={styles.contentContainerStyle}
                contentStyle={styles.contentContainerStyle}
            >
                <Dialog.Title>
                    <Text style={styles.titleStyle}>{this.state.title}</Text>
                </Dialog.Title>
                <Dialog.Description>
                    <Text style={styles.descriptionStyle}>{this.state.message}</Text>
                </Dialog.Description>
                {this.state.isPrompt && (
                    <Dialog.Input
                        onChangeText={inputValue => this.setState({ inputValue })}
                        label={this.state.defaultInputValue}
                    />
                )}
                <Dialog.Button
                    label={
                        this.state.isAlert
                            ? this.state.cancelButton?.text
                                ? this.state.cancelButton.text
                                : translate('App.labels.cancel')
                            : this.state.isConfirm
                            ? translate('App.labels.cancel')
                            : this.state.cancelButtonText
                    }
                    onPress={() => {
                        if (this.state.isAlert) {
                            this.hideAlert();
                            this.state.cancelButton?.onPress && this.state.cancelButton?.onPress();
                        } else if (this.state.isPrompt) {
                            this.hidePrompt();
                            this.showAlertDeferred && this.showAlertDeferred.resolve('');
                        } else if (this.state.isConfirm) {
                            this.hideConfirm();
                            this.showAlertDeferred && this.showAlertDeferred.resolve(false);
                        }
                    }}
                    color={theme.colors.accent}
                />
                <Dialog.Button
                    label={
                        this.state.isAlert
                            ? this.state.confirmButton?.text
                                ? this.state.confirmButton.text
                                : translate('App.labels.ok')
                            : this.state.isConfirm
                            ? translate('App.labels.ok')
                            : this.state.confirmButtonText
                    }
                    onPress={() => {
                        if (this.state.isAlert) {
                            this.hideAlert();
                            this.state.confirmButton?.onPress &&
                                this.state.confirmButton?.onPress();
                        } else if (this.state.isPrompt) {
                            this.hidePrompt();
                            this.showAlertDeferred &&
                                this.showAlertDeferred.resolve(this.state.inputValue);
                        } else if (this.state.isConfirm) {
                            this.hideConfirm();
                            this.showAlertDeferred && this.showAlertDeferred.resolve(true);
                        }
                    }}
                    color={theme.colors.accent}
                />
            </Dialog.Container>
        );
    }
}

export const AlertModal = smartConnect<IExternalProps>(AlertModalComponent, [
    withTheme(stylesProvider)
]);
