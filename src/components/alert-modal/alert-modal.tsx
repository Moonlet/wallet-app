import React from 'react';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Deferred } from '../../core/utils/deferred';
import { Text } from '../../library';
import Dialog from 'react-native-dialog';

export interface IExternalProps {
    obRef?: any;
}

interface IState {
    isPrompt: boolean;
    visible: boolean;
    title: string;
    message: string;
    cancelButton: string;
    confirmButton: string;
    promptLabel: string;
    inputValue: string;
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
            isPrompt: false,
            visible: false,
            title: '',
            message: '',
            cancelButton: '',
            confirmButton: '',
            promptLabel: 'Type here',
            inputValue: ''
        };
        props.obRef && props.obRef(this);
    }

    public async showAlert(
        title: string,
        message: string,
        cancelButton: string,
        confirmButton: string
    ): Promise<boolean> {
        this.showAlertDeferred = new Deferred();

        this.setState({
            visible: true,
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
        cancelButton: string,
        confirmButton: string,
        promptLabel?: string
    ): Promise<string> {
        this.showAlertDeferred = new Deferred();

        this.setState({
            isPrompt: true,
            visible: true,
            title,
            message,
            cancelButton,
            confirmButton,
            promptLabel
        });

        return this.showAlertDeferred.promise;
    }

    public hideAlert = () => this.setState({ visible: false });

    public hidePrompt = () => this.setState({ visible: false, isPrompt: false, inputValue: '' });

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
                        label={this.state.promptLabel}
                    />
                )}
                <Dialog.Button
                    label={this.state.cancelButton}
                    onPress={() => {
                        if (this.state.isPrompt) {
                            this.hidePrompt();
                            this.showAlertDeferred && this.showAlertDeferred.resolve('');
                        } else {
                            this.hideAlert();
                            this.showAlertDeferred && this.showAlertDeferred.resolve(false);
                        }
                    }}
                    color={theme.colors.accent}
                />
                <Dialog.Button
                    label={this.state.confirmButton}
                    onPress={() => {
                        if (this.state.isPrompt) {
                            this.hidePrompt();
                            this.showAlertDeferred &&
                                this.showAlertDeferred.resolve(this.state.inputValue);
                        } else {
                            this.hideAlert();
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
