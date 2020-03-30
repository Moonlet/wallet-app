import React from 'react';
import { Platform, View } from 'react-native';
import { Deferred } from '../../core/utils/deferred';
import { PasswordPin } from './components/password-pin/password-pin';
import { translate } from '../../core/i18n';
import { PasswordTerms } from './components/password-terms/password-terms';
import Modal from '../../library/modal/modal';
import bind from 'bind-decorator';
import { getPassword, setPassword, clearPassword } from '../../core/secure/keychain';
import { changePIN } from '../../redux/wallets/actions';
import { Text } from '../../library';
import { IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { IReduxState } from '../../redux/state';
import {
    incrementFailedLogins,
    resetFailedLogins,
    setAppBlockUntil,
    resetAllData
} from '../../redux/app/actions';
import { RESET_APP_FAILED_LOGINS, FAILED_LOGIN_BLOCKING } from '../../core/constants/app';
import moment from 'moment';
import { NavigationService } from '../../navigation/navigation-service';

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
    errorMessage: string;
    enableBiometryAuth: boolean;
    countdownListenerTime: number;
    allowBackButton: boolean;
}

const EMPTY_STRING = ' ';

export interface IReduxProps {
    changePIN: typeof changePIN;
    failedLogins: number;
    blockUntil: Date;
    incrementFailedLogins: typeof incrementFailedLogins;
    resetFailedLogins: typeof resetFailedLogins;
    setAppBlockUntil: typeof setAppBlockUntil;
    resetAllData: typeof resetAllData;
}

export const mapStateToProps = (state: IReduxState) => ({
    failedLogins: state.app.failedLogins,
    blockUntil: state.app.blockUntil
});

export const mapDispatchToProps = {
    changePIN,
    incrementFailedLogins,
    resetFailedLogins,
    setAppBlockUntil,
    resetAllData
};

export class PasswordModalComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static refDeferred: Deferred<PasswordModalComponent> = new Deferred();
    public countdownListener;

    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        PasswordModalComponent.refDeferred.resolve(this);
        this.state = {
            visible: false,
            title: undefined,
            subtitle: undefined,
            password: undefined,
            newPassword: undefined,
            currentStep: undefined,
            errorMessage: EMPTY_STRING,
            enableBiometryAuth: true,
            countdownListenerTime: 0,
            allowBackButton: false
        };
    }

    public componentDidMount() {
        this.setCountdownListener();
    }

    private setCountdownListener() {
        if (this.props.setAppBlockUntil) {
            clearInterval(this.countdownListener);
            this.countdownListener = setInterval(
                () =>
                    this.setState(prevstate => ({
                        countdownListenerTime: prevstate.countdownListenerTime + 1
                    })),
                1000
            );
        }
    }

    public componentWillUnmount() {
        clearInterval(this.countdownListener);
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
            currentStep: ScreenStep.ENTER_PIN,
            enableBiometryAuth: true,
            allowBackButton: false
        });
        return this.resultDeferred.promise;
    }

    public createPassword(subtitle?: string) {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            title: translate('Password.setupPinTitle'),
            subtitle,
            currentStep: ScreenStep.CREATE_PIN_TERMS,
            enableBiometryAuth: false,
            allowBackButton: true
        });
        return this.resultDeferred.promise;
    }

    public changePassword() {
        this.resultDeferred = new Deferred();
        this.setState({
            visible: true,
            title: translate('Password.pinTitleUnlock'),
            subtitle: translate('Password.changePinSubtitle'),
            currentStep: ScreenStep.CHANGE_PIN_TERMS,
            enableBiometryAuth: false,
            allowBackButton: true
        });
        return this.resultDeferred.promise;
    }

    private onBackButtonTap() {
        this.setState({ visible: false });
        this.resultDeferred && this.resultDeferred.reject();
    }

    private clearErrorMessage() {
        this.setState({ errorMessage: EMPTY_STRING });
    }

    private async handleWrongPassword() {
        this.setCountdownListener();

        let index = 0;
        for (let i = 0; i < Object.keys(FAILED_LOGIN_BLOCKING).length; i++) {
            if (this.props.failedLogins < Number(Object.keys(FAILED_LOGIN_BLOCKING)[i])) {
                index = i;
                break;
            }
        }

        const attempts: number =
            Number(Object.keys(FAILED_LOGIN_BLOCKING)[index]) - this.props.failedLogins - 1;

        this.setState({
            errorMessage:
                attempts === 1
                    ? translate('Password.invalidPasswordAttempt')
                    : attempts === 0
                    ? translate('Password.invalidPassword')
                    : translate('Password.invalidPasswordAttempts', { attempts })
        });

        this.props.incrementFailedLogins();

        this.props.setAppBlockUntil(
            new Date(new Date().getTime() + FAILED_LOGIN_BLOCKING[this.props.failedLogins])
        );

        if (this.props.failedLogins === RESET_APP_FAILED_LOGINS) {
            NavigationService.popToTop();
            NavigationService.navigate('OnboardingNavigation', {});
            this.setState({ visible: false });
            this.props.resetAllData();
            await clearPassword();
        }
    }

    @bind
    private async updateState(data: { password?: string; biometryAuthResult?: boolean }) {
        let isPasswordValid = await this.verifyPassword(data.password);
        if (data?.biometryAuthResult === true) {
            isPasswordValid = data.biometryAuthResult;
        }

        switch (this.state.currentStep) {
            // Enter PIN Flow
            case ScreenStep.ENTER_PIN:
                if (isPasswordValid) {
                    this.props.resetFailedLogins();
                    this.props.setAppBlockUntil(undefined);
                    this.resultDeferred && this.resultDeferred.resolve(data.password);
                    this.setState({ visible: false });
                } else {
                    this.handleWrongPassword();
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
                    this.handleWrongPassword();
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
                    this.handleWrongPassword();
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
                    await setPassword(this.state.newPassword, false);
                    this.resultDeferred && this.resultDeferred.resolve(this.state.newPassword);
                    this.setState({ visible: false });
                } else {
                    this.handleWrongPassword();
                }
                break;

            default:
                break;
        }
    }

    private async verifyPassword(value: string): Promise<boolean> {
        if (Platform.OS === 'web') {
            return true;
        } else {
            try {
                const passwordCredentials = await getPassword();
                return value === passwordCredentials.password;
            } catch {
                this.setState({ errorMessage: translate('Password.genericError') });
                return false;
            }
        }
    }

    private getCurrentDate(): Date {
        // TODO: check currentDate not to be hacked
        return new Date();
    }

    private renderMoonletDisabled() {
        const { blockUntil, styles } = this.props;

        const currentDate = moment(this.getCurrentDate());
        const duration = moment.duration(moment(new Date(blockUntil)).diff(currentDate));

        const seconds = Math.floor(duration.asSeconds());
        const minutes = Math.floor(duration.asMinutes());
        const hours = Math.floor(duration.asHours());
        const days = Math.floor(duration.asDays());

        let timeMeasurement: string;
        let coundownTime: number;
        if (days > 0) {
            timeMeasurement = days === 1 ? translate('Time.day') : translate('Time.days');
            coundownTime = days;
        } else if (hours > 0) {
            timeMeasurement = hours === 1 ? translate('Time.hour') : translate('Time.hours');
            coundownTime = hours;
        } else if (minutes > 0) {
            timeMeasurement = minutes === 1 ? translate('Time.minute') : translate('Time.minutes');
            coundownTime = minutes;
        } else {
            timeMeasurement = seconds === 1 ? translate('Time.second') : translate('Time.seconds');
            coundownTime = seconds;
        }

        return (
            <View style={styles.wrongPasswordContainer}>
                <Text style={styles.moonletDisabled}>{translate('Password.moonletDisabled')}</Text>
                <Text style={styles.disabledDetails}>
                    {translate('Password.disabledDetails', {
                        duration: coundownTime,
                        measurement: timeMeasurement
                    })}
                </Text>
            </View>
        );
    }

    private isMoonletDisabled(): boolean {
        return this.props.blockUntil && new Date(this.props.blockUntil) > this.getCurrentDate();
    }

    public render() {
        return (
            <Modal isVisible={this.state.visible} animationInTiming={5} animationOutTiming={5}>
                {this.state.currentStep === ScreenStep.CREATE_PIN_TERMS ||
                this.state.currentStep === ScreenStep.CHANGE_PIN_TERMS ? (
                    <PasswordTerms onAcknowledged={() => this.updateState({})} />
                ) : (
                    <PasswordPin
                        title={this.state.title}
                        subtitle={this.state.subtitle}
                        onPasswordEntered={this.updateState}
                        onBiometryLogin={(success: boolean) => {
                            if (success === true) {
                                this.updateState({ biometryAuthResult: true });
                            } else {
                                this.updateState({ biometryAuthResult: false });
                            }
                        }}
                        errorMessage={this.state.errorMessage}
                        clearErrorMessage={() => this.clearErrorMessage()}
                        enableBiometryAuth={this.state.enableBiometryAuth}
                        allowBackButton={this.state.allowBackButton}
                        onBackButtonTap={() => this.onBackButtonTap()}
                    />
                )}

                {this.isMoonletDisabled() && this.renderMoonletDisabled()}
            </Modal>
        );
    }
}
