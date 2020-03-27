import React from 'react';
import { Platform } from 'react-native';
import { Deferred } from '../../core/utils/deferred';
import { PasswordPin } from './components/password-pin/password-pin';
import { translate } from '../../core/i18n';
import { PasswordTerms } from './components/password-terms/password-terms';
import Modal from '../../library/modal/modal';
import bind from 'bind-decorator';
import { getPassword } from '../../core/secure/keychain';

enum ScreenStep {
    ENTER_PIN = 'ENTER_PIN',

    CREATE_PIN_TERMS = 'CREATE_PIN_TERMS',
    CREATE_PIN = 'CREATE_PIN',
    CREATE_PIN_CONFIRM = 'CREATE_PIN_CONFIRM',

    CHANGE_PIN_TERMS = 'CHANGE_PIN_TERMS',
    CHANGE_PIN_CURRENT = 'CHANGE_PIN_CURRENT',
    CHANGE_PIN_NEW = 'CHANGE_PIN_NEW',
    CHANGE_PIN_CONFIRM = 'CHANGE_PIN_CONFIRM'
}

export interface IState {
    visible: boolean;
    title: string;
    subtitle: string;
    password: string;
    newPassword: string;
    currentStep: ScreenStep;
    error: string;
}

export class PasswordModal extends React.Component<{}, IState> {
    public static refDeferred: Deferred<PasswordModal> = new Deferred();

    constructor(props) {
        super(props);
        PasswordModal.refDeferred.resolve(this);
        this.state = {
            visible: false,
            title: undefined,
            subtitle: undefined,
            password: undefined,
            newPassword: undefined,
            currentStep: undefined,
            error: ' '
        };
    }

    public static async getPassword(title?: string, subtitle?: string) {
        const ref = await PasswordModal.refDeferred.promise;
        return ref.getPassword(title, subtitle);
    }

    public static async createPassword() {
        const ref = await PasswordModal.refDeferred.promise;
        return ref.createPassword();
    }

    public static async changePassword() {
        const ref = await PasswordModal.refDeferred.promise;
        return ref.changePassword();
    }

    private resultDeferred: any;

    public getPassword(title?: string, subtitle?: string) {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            title: title || translate('Password.pinTitleUnlock'),
            subtitle: subtitle || translate('Password.pinSubtitleUnlock'),
            currentStep: ScreenStep.ENTER_PIN
        });
        return this.resultDeferred.promise;
    }

    public createPassword() {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            currentStep: ScreenStep.CREATE_PIN_TERMS
        });
        return this.resultDeferred.promise;
    }

    public changePassword() {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            currentStep: ScreenStep.CHANGE_PIN_TERMS
        });
        return this.resultDeferred.promise;
    }

    // private onCloseTap() {
    //     // promise reject
    // }

    @bind
    private async updateState(data: { password?: string }) {
        switch (this.state.currentStep) {
            case ScreenStep.ENTER_PIN:
                const verify = await this.verifyPassword(data.password);
                if (verify) {
                    // set failed logins = 0
                    this.resultDeferred && this.resultDeferred.resolve(data.password);
                    this.setState({ visible: false });
                } else {
                    // reject
                }
                break;

            case ScreenStep.CREATE_PIN_TERMS:
                this.setState({ currentStep: ScreenStep.CREATE_PIN });
                break;
            case ScreenStep.CREATE_PIN:
                this.setState({
                    currentStep: ScreenStep.CREATE_PIN_CONFIRM,
                    password: data.password
                });
                break;
            case ScreenStep.CREATE_PIN_CONFIRM:
                if (this.state.password === data.password) {
                    // TODO: promise resolve
                } else {
                    // TODO: show error
                }
                break;

            case ScreenStep.CHANGE_PIN_TERMS:
                this.setState({ currentStep: ScreenStep.CHANGE_PIN_CURRENT });
                break;
            case ScreenStep.CHANGE_PIN_CURRENT:
                // TODO: check pin is ok
                this.setState({
                    currentStep: ScreenStep.CHANGE_PIN_NEW,
                    password: data.password
                });
                break;
            case ScreenStep.CHANGE_PIN_NEW:
                this.setState({
                    currentStep: ScreenStep.CHANGE_PIN_CONFIRM,
                    newPassword: data.password
                });
                break;
            case ScreenStep.CHANGE_PIN_CONFIRM:
                if (this.state.newPassword === data.password) {
                    // TODO: save in storage
                    // TODO: promise resolve
                } else {
                    // TODO: show error
                }
                break;
        }
    }

    private async verifyPassword(value: string): Promise<boolean> {
        this.setState({ error: ' ' });
        if (Platform.OS === 'web') {
            return true;
        } else {
            try {
                const passwordCredentials = await getPassword();
                if (passwordCredentials) {
                    if (value === passwordCredentials.password) {
                        this.setState({ error: ' ' });
                        return true;
                    } else {
                        this.setState({ error: translate('Password.invalidPassword') });
                        return false;
                    }
                } else {
                    this.setState({ error: translate('Password.genericError') });
                    return false;
                }
            } catch {
                this.setState({ error: translate('Password.genericError') });
                return false;
            }
        }
    }

    public render() {
        const { currentStep } = this.state;
        return (
            <Modal isVisible={this.state.visible} animationInTiming={5} animationOutTiming={5}>
                {currentStep === ScreenStep.CREATE_PIN_TERMS ||
                currentStep === ScreenStep.CHANGE_PIN_TERMS ? (
                    <PasswordTerms
                        onAcknowledged={this.updateState}
                        // onAcknowledged={() => this.onAcknowledged()}
                        // changePIN={this.state.changePIN}
                    />
                ) : (
                    <PasswordPin
                        title={this.state.title}
                        subtitle={this.state.subtitle}
                        onPasswordEntered={this.updateState}
                        onBiometryLogin={(success: boolean) => {
                            if (success) {
                                this.updateState({});
                            } else {
                                // console.log('ERROR BIOMETRY');
                            }
                        }}
                        errorMessage={this.state.error}
                    />
                )}
                {/* <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#000000BF',
                        justifyContent: 'center'
                    }}
                >
                    <Text>Countdown</Text>
                </View> */}
            </Modal>
        );
    }
}
