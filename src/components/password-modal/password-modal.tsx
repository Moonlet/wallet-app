import React from 'react';
import { Modal } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { getPassword, setPassword } from '../../core/secure/keychain';
import { Deferred } from '../../core/utils/deferred';
import { PasswordPin } from './components/password-pin/password-pin';
import bind from 'bind-decorator';
import { translate } from '../../core/i18n';
import { PasswordTerms } from './components/password-terms/password-terms';

export interface IExternalProps {
    shouldCreatePassword?: boolean;
    title?: string;
    subtitle?: string;
    obRef: any;
}

interface IState {
    visible: boolean;
    title: string;
    subtitle: string;
    showTerms: boolean;
    createPass: boolean;
    verifyPass: boolean;
}

export class PasswordModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private passwordRequestDeferred;
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            visible: false,
            title: props.title ? props.title : translate('Password.pinTitleUnlock'),
            subtitle: props.subtitle ? props.subtitle : translate('Password.pinSubtitleUnlock'),
            showTerms: false,
            createPass: false,
            verifyPass: false
        };
        props.obRef && props.obRef(this);
    }

    public async requestPassword(): Promise<string> {
        this.passwordRequestDeferred = new Deferred();

        this.setState({ visible: true });
        const keychainPassword = await getPassword();
        if (keychainPassword) {
            this.setState({
                showTerms: false
            });
        } else {
            this.setState({
                showTerms: true
            });
        }

        return this.passwordRequestDeferred.promise;
    }

    @bind
    public async onPasswordEntered(value: string): Promise<string> {
        if (this.state.createPass === true) {
            this.setState({
                createPass: false,
                verifyPass: true,
                title: translate('Password.verifyPinTitle'),
                subtitle: translate('Password.verifyPinSubtitle')
            });
            return;
        }
        if (this.state.verifyPass === true) {
            await setPassword(value);
            this.passwordRequestDeferred && this.passwordRequestDeferred.resolve(value);
            this.setState({
                visible: false
            });
            return value;
        }

        const verifyPassword = await this.verifyPassword(value);
        if (verifyPassword.pass) {
            this.passwordRequestDeferred && this.passwordRequestDeferred.resolve(value);
            this.setState({
                visible: false
            });
            return undefined;
        } else {
            return verifyPassword.errorMessage;
        }
    }
    @bind
    public onAcknowledged() {
        this.setState({
            showTerms: false,
            createPass: true,
            verifyPass: false,
            subtitle: translate('Password.setupPinSubtitle'),
            title: translate('Password.setupPinTitle')
        });
    }

    public render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.visible}
                presentationStyle={'overFullScreen'}
            >
                {this.state.showTerms ? (
                    <PasswordTerms onAcknowledged={this.onAcknowledged} />
                ) : (
                    <PasswordPin
                        title={this.state.title}
                        subtitle={this.state.subtitle}
                        onPasswordEntered={this.onPasswordEntered}
                    />
                )}
            </Modal>
        );
    }

    private async verifyPassword(value): Promise<{ pass: string; errorMessage: string }> {
        try {
            const passwordCredentials = await getPassword();
            if (passwordCredentials) {
                if (value === passwordCredentials.password) {
                    return { pass: value, errorMessage: '' };
                } else {
                    return { pass: null, errorMessage: translate('Password.invalidPassword') };
                }
            } else {
                return { pass: null, errorMessage: translate('Password.genericError') };
            }
        } catch {
            return { pass: null, errorMessage: translate('Password.genericError') };
        }
    }
}

export const PasswordModal = smartConnect<IExternalProps>(PasswordModalComponent, [
    withTheme(stylesProvider)
]);
