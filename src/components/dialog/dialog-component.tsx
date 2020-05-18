import React from 'react';
import { KeyboardTypeOptions, Platform } from 'react-native';
import { IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { Deferred } from '../../core/utils/deferred';
import RNDialog from 'react-native-dialog';
import { translate } from '../../core/i18n';
import bind from 'bind-decorator';
import { setInstance, waitForInstance } from '../../core/utils/class-registry';

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
    private dialogHideDeffered: Deferred;
    private resultDeferred: Deferred;

    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        setInstance(DialogComponent, this);

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
    }

    public static async alert(
        title: string,
        message: string,
        cancelButton: IAlertButton,
        confirmButton: IAlertButton
    ): Promise<boolean> {
        return waitForInstance<DialogComponent>(DialogComponent).then(ref =>
            ref.showAlert(title, message, cancelButton, confirmButton)
        );
    }

    public static async prompt(
        title: string,
        message: string,
        cancelButtonText?: string,
        confirmButtonText?: string,
        defaultInputValue?: string,
        keyboardType?: KeyboardTypeOptions
    ): Promise<string> {
        return waitForInstance<DialogComponent>(DialogComponent).then(ref =>
            ref.showPrompt(
                title,
                message,
                cancelButtonText || translate('App.labels.cancel'),
                confirmButtonText || translate('App.labels.save'),
                defaultInputValue,
                keyboardType
            )
        );
    }

    public static async confirm(title: string, message: string): Promise<boolean> {
        return waitForInstance<DialogComponent>(DialogComponent).then(ref =>
            ref.showConfirm(title, message)
        );
    }

    public static async info(title: string, message: string): Promise<boolean> {
        return waitForInstance<DialogComponent>(DialogComponent).then(ref =>
            ref.showInfo(title, message)
        );
    }

    public async showAlert(
        title: string,
        message: string,
        cancelButton: IAlertButton,
        confirmButton: IAlertButton
    ): Promise<boolean> {
        this.resultDeferred = new Deferred();
        this.dialogHideDeffered = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.ALERT,
            title,
            message,
            cancelButton,
            confirmButton
        });

        return this.resultDeferred.promise;
    }

    public async showPrompt(
        title: string,
        message: string,
        cancelButtonText: string,
        confirmButtonText: string,
        defaultInputValue?: string,
        keyboardType?: KeyboardTypeOptions
    ): Promise<string> {
        this.resultDeferred = new Deferred();
        this.dialogHideDeffered = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.PROMPT,
            title,
            message,
            cancelButtonText,
            confirmButtonText,
            defaultInputValue,
            keyboardType,
            inputValue: ''
        });

        return this.resultDeferred.promise;
    }

    public async showConfirm(title: string, message: string): Promise<boolean> {
        this.resultDeferred = new Deferred();
        this.dialogHideDeffered = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.CONFIRM,
            title,
            message
        });

        return this.resultDeferred.promise;
    }

    public async showInfo(title: string, message: string): Promise<boolean> {
        this.resultDeferred = new Deferred();
        this.dialogHideDeffered = new Deferred();

        this.setState({
            visible: true,
            dialogType: DialogType.INFO,
            title,
            message
        });

        return this.resultDeferred.promise;
    }

    private onCloseDialog(callback: () => void) {
        this.setState({ visible: false }, () => callback());
    }

    @bind
    private onBackCloseDialog() {
        this.setState({ visible: false });
    }

    public cancelButtonPress() {
        switch (this.state.dialogType) {
            case DialogType.ALERT:
                this.onCloseDialog(async () => {
                    await this.dialogHideDeffered?.promise;
                    this.state.cancelButton?.onPress();
                });
                break;
            case DialogType.CONFIRM:
                this.onCloseDialog(async () => {
                    await this.dialogHideDeffered?.promise;
                    this.resultDeferred?.resolve(false);
                });
                break;
            case DialogType.PROMPT:
                this.onCloseDialog(async () => {
                    await this.dialogHideDeffered?.promise;
                    this.resultDeferred?.resolve('');
                });
                break;
            default:
                this.onCloseDialog(() => {
                    //
                });
                break;
        }
    }

    public confirmButtonPress() {
        switch (this.state.dialogType) {
            case DialogType.ALERT:
                this.onCloseDialog(async () => {
                    await this.dialogHideDeffered?.promise;
                    this.state.confirmButton?.onPress();
                });
                break;
            case DialogType.CONFIRM:
                this.onCloseDialog(async () => {
                    await this.dialogHideDeffered?.promise;
                    this.resultDeferred?.resolve(true);
                });
                break;
            case DialogType.PROMPT:
                this.onCloseDialog(async () => {
                    await this.dialogHideDeffered?.promise;
                    this.resultDeferred?.resolve(this.state.inputValue);
                });
                break;
            case DialogType.INFO:
                this.onCloseDialog(async () => {
                    await this.dialogHideDeffered?.promise;
                    this.resultDeferred?.resolve(true);
                });
                break;
            default:
                this.onCloseDialog(() => {
                    //
                });
                break;
        }
    }

    public render() {
        const { styles, theme } = this.props;

        return (
            <RNDialog.Container
                visible={this.state.visible}
                blurStyle={styles.contentContainerStyle}
                contentStyle={styles.contentContainerStyle}
                onModalHide={() => this.dialogHideDeffered?.resolve()}
                {...{
                    onBackdropPress: this.onBackCloseDialog
                }}
            >
                <RNDialog.Title style={styles.titleStyle}>{this.state.title}</RNDialog.Title>
                <RNDialog.Description style={styles.descriptionStyle}>
                    {this.state.message}
                </RNDialog.Description>
                {this.state.dialogType === DialogType.PROMPT && (
                    <RNDialog.Input
                        style={Platform.select({
                            ios: styles.textInputIOS,
                            default: styles.textInputDefault
                        })}
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
                        onPress={() => this.cancelButtonPress()}
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
                    onPress={() => this.confirmButtonPress()}
                    color={theme.colors.accent}
                />
            </RNDialog.Container>
        );
    }
}
