import React from 'react';
import { Platform } from 'react-native';
import { Deferred } from '../../core/utils/deferred';
import { PasswordPin } from './components/password-pin/password-pin';
import { translate } from '../../core/i18n';
import { PasswordTerms } from './components/password-terms/password-terms';
import Modal from '../../library/modal/modal';
import bind from 'bind-decorator';
import { getPassword, setPassword } from '../../core/secure/keychain';
import { changePIN } from '../../redux/wallets/actions';

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

const EMPTY_STRING = ' ';

export interface IReduxProps {
    changePIN: typeof changePIN;
}

export const mapDispatchToProps = {
    changePIN
};

export class PasswordModalComponent extends React.Component<IReduxProps, IState> {
    public static refDeferred: Deferred<PasswordModalComponent> = new Deferred();

    constructor(props: IReduxProps) {
        super(props);
        PasswordModalComponent.refDeferred.resolve(this);
        this.state = {
            visible: false,
            title: undefined,
            subtitle: undefined,
            password: undefined,
            newPassword: undefined,
            currentStep: undefined,
            error: EMPTY_STRING
        };
    }

    public static async getPassword(title?: string, subtitle?: string) {
        const ref = await PasswordModalComponent.refDeferred.promise;
        return ref.getPassword(title, subtitle);
    }

    public static async createPassword(subtitle?: string) {
        const ref = await PasswordModalComponent.refDeferred.promise;
        return ref.createPassword(subtitle);
    }

    public static async changePassword() {
        const ref = await PasswordModalComponent.refDeferred.promise;
        return ref.changePassword();
    }

    private resultDeferred: any;

    public getPassword(title?: string, subtitle?: string): Promise<string> {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            title: title || translate('Password.pinTitleUnlock'),
            subtitle: subtitle || translate('Password.pinSubtitleUnlock'),
            currentStep: ScreenStep.ENTER_PIN
        });
        return this.resultDeferred.promise;
    }

    public createPassword(subtitle?: string) {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            title: translate('Password.setupPinTitle'),
            subtitle,
            currentStep: ScreenStep.CREATE_PIN_TERMS
        });
        return this.resultDeferred.promise;
    }

    public changePassword() {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            title: translate('Password.pinTitleUnlock'),
            subtitle: translate('Password.changePinSubtitle'),
            currentStep: ScreenStep.CHANGE_PIN_TERMS
        });
        return this.resultDeferred.promise;
    }

    // private onCloseTap() {
    //     // promise reject
    // }

    @bind
    private async updateState(data: { password?: string }) {
        const isPasswordValid = await this.verifyPassword(data.password);
        this.setState({ error: EMPTY_STRING }); // TODO: check this

        switch (this.state.currentStep) {
            // Enter PIN Flow
            case ScreenStep.ENTER_PIN:
                if (isPasswordValid) {
                    // set failed logins = 0
                    this.resultDeferred && this.resultDeferred.resolve(data.password);
                    this.setState({ visible: false });
                }
                break;

            // Create PIN Flow
            case ScreenStep.CREATE_PIN_TERMS:
                this.setState({ currentStep: ScreenStep.CREATE_PIN });
                break;
            case ScreenStep.CREATE_PIN:
                this.setState({
                    currentStep: ScreenStep.CREATE_PIN_CONFIRM,
                    password: data.password,
                    title: translate('Password.verifyPinTitle'),
                    subtitle: translate('Password.verifyPinSubtitle')
                });
                break;
            case ScreenStep.CREATE_PIN_CONFIRM:
                if (this.state.password === data.password) {
                    await setPassword(data.password, false);
                    this.resultDeferred && this.resultDeferred.resolve(data.password);
                    this.setState({ visible: false });
                } else {
                    this.setState({ error: translate('Password.invalidPassword') });
                }
                break;

            // Change PIN Flow
            case ScreenStep.CHANGE_PIN_TERMS:
                this.setState({ currentStep: ScreenStep.CHANGE_PIN_CURRENT });
                break;
            case ScreenStep.CHANGE_PIN_CURRENT:
                if (isPasswordValid) {
                    this.setState({
                        currentStep: ScreenStep.CHANGE_PIN_NEW,
                        password: data.password,
                        title: translate('Password.setupPinTitle'),
                        subtitle: translate('Password.setupPinSubtitle')
                    });
                } else {
                    this.setState({ error: translate('Password.invalidPassword') });
                }
                break;
            case ScreenStep.CHANGE_PIN_NEW:
                this.setState({
                    currentStep: ScreenStep.CHANGE_PIN_CONFIRM,
                    title: translate('Password.verifyPinTitle'),
                    subtitle: translate('Password.verifyPinSubtitle'),
                    newPassword: data.password
                });
                break;
            case ScreenStep.CHANGE_PIN_CONFIRM:
                if (this.state.newPassword === data.password) {
                    // Save new PIN in storage
                    // this.state.password is the old password
                    this.props.changePIN(this.state.newPassword, this.state.password);
                    await setPassword(data.password, false);
                    this.resultDeferred && this.resultDeferred.resolve(this.state.newPassword);
                    this.setState({ visible: false });
                } else {
                    this.setState({ error: translate('Password.invalidPassword') });
                }
                break;

            default:
                break;
        }
    }

    private async verifyPassword(value: string): Promise<boolean> {
        this.setState({ error: EMPTY_STRING });
        if (Platform.OS === 'web') {
            return true;
        } else {
            try {
                const passwordCredentials = await getPassword();
                if (passwordCredentials) {
                    if (value === passwordCredentials.password) {
                        this.setState({ error: EMPTY_STRING });
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
                        onAcknowledged={() => this.updateState({})}
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
                        clearErrorMessage={() => this.setState({ error: EMPTY_STRING })}
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
