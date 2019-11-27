import React from 'react';
import { Modal } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { getPassword } from '../../core/secure/keychain';
import { Deferred } from '../../core/utils/deferred';
import { PasswordPin } from './components/password-pin.tsx/password-pin';
import bind from 'bind-decorator';
import { translate } from '../../core/i18n';

export interface IExternalProps {
    shouldCreatePassword?: boolean;
    title?: string;
    subtitle?: string;
    obRef: any;
}

interface IState {
    visible: boolean;
    title: string;
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
            title: props.title ? props.title : translate('Password.pinTitleUnlock')
        };
        props.obRef && props.obRef(this);
    }

    public async requestPassword(): Promise<string> {
        this.passwordRequestDeferred = new Deferred();

        this.setState({ visible: true });
        const keychainPassword = await getPassword();
        if (keychainPassword) {
            this.setState({
                visible: true
            });
        } else {
            this.setState({
                visible: true
            });
        }

        return this.passwordRequestDeferred.promise;
    }

    @bind
    public async onPasswordEntered(value: string): Promise<string> {
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

    public render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.visible}
                presentationStyle={'overFullScreen'}
            >
                {/* {this.state.displayAskPassword === false &&
                    this.state.displayCreatePassword === false && (
                        <View style={this.props.styles.loading}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )} */}
                <PasswordPin
                    title={this.state.title}
                    subtitle={
                        this.props.subtitle
                            ? this.props.subtitle
                            : translate('Password.pinSubtitleUnlock')
                    }
                    onPasswordEntered={this.onPasswordEntered}
                />
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
