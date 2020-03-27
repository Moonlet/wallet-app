import React from 'react';
import { KeyboardTypeOptions, Platform, View } from 'react-native';
import { IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { Deferred } from '../../core/utils/deferred';
import RNDialog from 'react-native-dialog';
import { translate } from '../../core/i18n';

export interface IAlertButton {
    text?: string;
    onPress?: (value?: string) => void;
}

export enum DialogType {
    ALERT = 'ALERT',
    CONFIRM = 'CONFIRM',
    PROMPT = 'PROMPT',
    INFO = 'INFO'
}

interface IState {
    visible: boolean;

    dialogType: DialogType;

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

export class DialogComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static ref: Deferred<DialogComponent> = new Deferred();

    public static async alert(
        title: string,
        message: string,
        cancelButton: IAlertButton,
        confirmButton: IAlertButton
    ): Promise<boolean> {
        const ref = await DialogComponent.ref.promise;

        const res = await ref.showAlert(title, message, cancelButton, confirmButton);

        return res;
    }

    public static async prompt(
        title: string,
        message: string,
        cancelButtonText?: string,
        confirmButtonText?: string,
        defaultInputValue?: string,
        keyboardType?: KeyboardTypeOptions
    ): Promise<string> {
        const ref = await DialogComponent.ref.promise;

        const res = await ref.showPrompt(
            title,
            message,
            cancelButtonText || translate('App.labels.cancel'),
            confirmButtonText || translate('App.labels.save'),
            defaultInputValue,
            keyboardType
        );

        return res;
    }

    public static async confirm(title: string, message: string): Promise<boolean> {
        const ref = await DialogComponent.ref.promise;

        const res = await ref.showConfirm(title, message);

        return res;
    }

    public static async info(title: string, message: string): Promise<boolean> {
        const ref = await DialogComponent.ref.promise;

        const res = await ref.showInfo(title, message);

        return res;
    }

    public input = null;
    private dialogDeferred = null;

    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            visible: false,

            dialogType: undefined,

            title: '',
            message: '',

            cancelButtonText: translate('App.labels.cancel'),
            confirmButtonText: translate('App.labels.ok'),

            cancelButton: undefined,
            confirmButton: undefined,

            defaultInputValue: translate('App.labels.typeHere'),
            inputValue: '',
            keyboardType: 'default'
        };

        DialogComponent.ref.resolve(this);
    }

    public async showAlert(
        title: string,
        message: string,
        cancelButton: IAlertButton,
        confirmButton: IAlertButton
    ): Promise<boolean> {
        this.dialogDeferred = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.ALERT,
            title,
            message,
            cancelButton,
            confirmButton
        });

        return this.dialogDeferred.promise;
    }

    public async showPrompt(
        title: string,
        message: string,
        cancelButtonText: string,
        confirmButtonText: string,
        defaultInputValue?: string,
        keyboardType?: KeyboardTypeOptions
    ): Promise<string> {
        this.dialogDeferred = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.PROMPT,
            title,
            message,
            cancelButtonText,
            confirmButtonText,
            defaultInputValue,
            keyboardType
        });

        return this.dialogDeferred.promise;
    }

    public async showConfirm(title: string, message: string): Promise<boolean> {
        this.dialogDeferred = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.CONFIRM,
            title,
            message
        });

        return this.dialogDeferred.promise;
    }

    public async showInfo(title: string, message: string): Promise<boolean> {
        this.dialogDeferred = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.INFO,
            title,
            message
        });

        return this.dialogDeferred.promise;
    }

    public closeDialog = () =>
        this.setState({
            visible: false,
            dialogType: undefined,
            cancelButton: undefined,
            confirmButton: undefined,
            inputValue: ''
        });

    public cancelButtonPress = () => {
        switch (this.state.dialogType) {
            case DialogType.ALERT:
                this.closeDialog();
                this.state.cancelButton?.onPress && this.state.cancelButton?.onPress();
                break;
            case DialogType.CONFIRM:
                this.closeDialog();
                this.dialogDeferred && this.dialogDeferred.resolve(false);
                break;
            case DialogType.PROMPT:
                this.closeDialog();
                this.dialogDeferred && this.dialogDeferred.resolve('');
                break;
            default:
                this.closeDialog();
                break;
        }
    };

    public confirmButtonPress = () => {
        switch (this.state.dialogType) {
            case DialogType.ALERT:
                this.closeDialog();
                this.state.confirmButton?.onPress && this.state.confirmButton?.onPress();
                break;
            case DialogType.CONFIRM:
                this.closeDialog();
                this.dialogDeferred && this.dialogDeferred.resolve(true);
                break;
            case DialogType.PROMPT:
                this.closeDialog();
                this.dialogDeferred && this.dialogDeferred.resolve(this.state.inputValue);
                break;
            case DialogType.INFO:
                this.closeDialog();
                this.dialogDeferred && this.dialogDeferred.resolve(true);
                break;
            default:
                this.closeDialog();
                break;
        }
    };

    public render() {
        const { styles, theme } = this.props;

        if (this.state.visible) {
            return (
                <View style={styles.dialogContainer}>
                    <RNDialog.Container
                        visible={this.state.visible}
                        blurStyle={styles.contentContainerStyle}
                        contentStyle={styles.contentContainerStyle}
                    >
                        <RNDialog.Title style={styles.titleStyle}>
                            {this.state.title}
                        </RNDialog.Title>
                        <RNDialog.Description style={styles.descriptionStyle}>
                            {this.state.message}
                        </RNDialog.Description>
                        {this.state.dialogType === DialogType.PROMPT && (
                            <RNDialog.Input
                                style={Platform.OS === 'android' && styles.textInput}
                                onChangeText={inputValue => this.setState({ inputValue })}
                                label={this.state.defaultInputValue}
                            />
                        )}
                        {this.state.dialogType !== DialogType.INFO && (
                            <RNDialog.Button
                                label={
                                    this.state.dialogType === DialogType.ALERT
                                        ? this.state.cancelButton?.text
                                            ? this.state.cancelButton.text
                                            : translate('App.labels.cancel')
                                        : this.state.dialogType === DialogType.CONFIRM
                                        ? translate('App.labels.cancel')
                                        : this.state.cancelButtonText
                                }
                                onPress={this.cancelButtonPress}
                                color={theme.colors.accent}
                            />
                        )}
                        <RNDialog.Button
                            label={
                                this.state.dialogType === DialogType.ALERT
                                    ? this.state.confirmButton?.text
                                        ? this.state.confirmButton.text
                                        : translate('App.labels.ok')
                                    : this.state.dialogType === DialogType.CONFIRM ||
                                      this.state.dialogType === DialogType.INFO
                                    ? translate('App.labels.ok')
                                    : this.state.confirmButtonText
                            }
                            onPress={this.confirmButtonPress}
                            color={theme.colors.accent}
                        />
                    </RNDialog.Container>
                </View>
            );
        } else {
            return <View />;
        }
    }
}
