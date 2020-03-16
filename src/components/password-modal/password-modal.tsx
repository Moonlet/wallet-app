import React from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { getPassword, setPassword } from '../../core/secure/keychain';
import { Deferred } from '../../core/utils/deferred';
import { PasswordPin } from './components/password-pin/password-pin';
import bind from 'bind-decorator';
import { translate } from '../../core/i18n';
import { PasswordTerms } from './components/password-terms/password-terms';
import Modal from '../../library/modal/modal';

export interface IExternalProps {
    shouldCreatePassword?: boolean;
    title?: string;
    subtitle?: string;
    obRef?: any;
    visible?: boolean;
    onPassword?: (password: string) => void;
    changePIN?: boolean;
}

interface IState {
    visible: boolean;
    title: string;
    subtitle: string;
    showTerms: boolean;
    createPass: boolean;
    verifyPass: boolean;
    updatePinProps: boolean;
    changePIN: boolean;
    clearPasswordInput: boolean;
    oldPassword: string;
}

export class PasswordModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private passwordRequestDeferred = null;
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            visible: props.visible || false,
            title: props.title || translate('Password.pinTitleUnlock'),
            subtitle: props.subtitle || translate('Password.pinSubtitleUnlock'),
            showTerms: false,
            createPass: false,
            verifyPass: false,
            updatePinProps: false,
            changePIN: props.changePIN || false,
            clearPasswordInput: false,
            oldPassword: undefined
        };
        props.obRef && props.obRef(this);
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible) {
            this.setState({ visible: this.props.visible });
        }
        if (this.props.changePIN && this.props.changePIN !== prevProps.changePIN) {
            this.setState({
                changePIN: this.props.changePIN,
                clearPasswordInput: false,
                oldPassword: undefined
            });
        }
    }

    public async requestPassword(): Promise<string> {
        if (Platform.OS === 'web') {
            Promise.resolve('000000');
            return undefined;
        }
        this.passwordRequestDeferred = new Deferred();

        this.setState({ visible: true });
        if (this.props.shouldCreatePassword) {
            const keychainPassword = await getPassword();

            if (keychainPassword && keychainPassword.username) {
                this.setState({ showTerms: false });
            } else {
                this.setState({ showTerms: true });
            }
        }
        if (this.props.changePIN) {
            this.setState({ showTerms: true });
        }

        return this.passwordRequestDeferred.promise;
    }

    @bind
    public async onBiometryLogin(success: boolean) {
        if (success) {
            this.setState({ visible: false });

            const keychainPassword = await getPassword();
            if (keychainPassword) {
                this.passwordRequestDeferred &&
                    this.passwordRequestDeferred.resolve(keychainPassword.password);

                this.props.onPassword && this.props.onPassword(keychainPassword.password);
            }
        }
    }

    @bind
    public async onPasswordEntered(value: string): Promise<string> {
        if (this.state.changePIN === true) {
            this.setState({ clearPasswordInput: true, oldPassword: value });

            const vfPassword = await this.verifyPassword(value);
            if (vfPassword.valid) {
                this.setState({
                    showTerms: false,
                    createPass: true,
                    verifyPass: false,
                    updatePinProps: false,
                    subtitle: translate('Password.setupPinSubtitle'),
                    title: translate('Password.setupPinTitle'),
                    changePIN: false
                });
                return;
            } else {
                this.setState({ clearPasswordInput: false });
                return vfPassword.errorMessage;
            }
        }
        if (this.state.createPass === true) {
            this.setState({
                createPass: false,
                verifyPass: true,
                updatePinProps: true,
                title: translate('Password.verifyPinTitle'),
                subtitle: translate('Password.verifyPinSubtitle')
            });
            return;
        }
        if (this.state.verifyPass === true) {
            await setPassword(value, false);

            if (this.state.oldPassword) {
                this.passwordRequestDeferred &&
                    this.passwordRequestDeferred.resolve({
                        newPassword: value,
                        oldPassword: this.state.oldPassword
                    });
            } else {
                this.passwordRequestDeferred && this.passwordRequestDeferred.resolve(value);
            }

            this.setState({
                visible: false
            });
            this.props.onPassword && this.props.onPassword(value);
            return;
        }

        const verifyPassword = await this.verifyPassword(value);
        if (verifyPassword.valid) {
            this.passwordRequestDeferred && this.passwordRequestDeferred.resolve(value);
            this.setState({
                visible: false
            });
            this.props.onPassword && this.props.onPassword(value);
            return undefined;
        } else {
            return verifyPassword.errorMessage;
        }
    }
    @bind
    public onAcknowledged() {
        if (this.state.changePIN) {
            this.setState({
                showTerms: false,
                createPass: true,
                updatePinProps: false,
                subtitle: translate('Password.changePinSubtitle')
            });
        } else {
            this.setState({
                showTerms: false,
                createPass: true,
                verifyPass: false,
                updatePinProps: false,
                subtitle: translate('Password.setupPinSubtitle'),
                title: translate('Password.setupPinTitle')
            });
        }
    }

    public render() {
        return (
            <View
                style={{
                    display: this.state.visible ? 'flex' : 'none',
                    position: 'absolute',
                    height: '100%'
                }}
            >
                <Modal isVisible={this.state.visible} animationInTiming={5}>
                    {this.state.showTerms ? (
                        <PasswordTerms
                            onAcknowledged={this.onAcknowledged}
                            changePIN={this.state.changePIN}
                        />
                    ) : (
                        <PasswordPin
                            updatePinProps={this.state.updatePinProps}
                            title={this.state.title}
                            subtitle={this.state.subtitle}
                            onPasswordEntered={this.onPasswordEntered}
                            onBiometryLogin={this.onBiometryLogin}
                            clearPasswordInput={this.state.clearPasswordInput}
                            changePIN={this.props.changePIN}
                        />
                    )}
                </Modal>
            </View>
        );
    }

    private async verifyPassword(value): Promise<{ valid: boolean; errorMessage: string }> {
        if (Platform.OS === 'web') {
            return { valid: true, errorMessage: '' };
        }
        try {
            const passwordCredentials = await getPassword();
            if (passwordCredentials) {
                if (value === passwordCredentials.password) {
                    return { valid: true, errorMessage: '' };
                } else {
                    return { valid: false, errorMessage: translate('Password.invalidPassword') };
                }
            } else {
                return { valid: false, errorMessage: translate('Password.genericError') };
            }
        } catch {
            return { valid: false, errorMessage: translate('Password.genericError') };
        }
    }
}

export const PasswordModal = smartConnect<IExternalProps>(PasswordModalComponent, [
    withTheme(stylesProvider)
]);
