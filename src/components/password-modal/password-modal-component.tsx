import React from 'react';
import { Platform, View } from 'react-native';
import { Deferred } from '../../core/utils/deferred';
import { PasswordPin } from './components/password-pin/password-pin';
import { translate } from '../../core/i18n';
import { PasswordTerms } from './components/password-terms/password-terms';
import Modal from '../../library/modal/modal';
import bind from 'bind-decorator';
import {
    getBaseEncryptionKey,
    verifyPinCode,
    generateEncryptionKey,
    getPinCode,
    setPinCode
} from '../../core/secure/keychain';
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
import NetInfo from '@react-native-community/netinfo';
import ntpClient from 'react-native-ntp-client';
import CONFIG from '../../config';
import { setDisplayPasswordModal } from '../../redux/ui/password-modal/actions';

const BLOCK_UNTIL_WAIT_INTERNET_CONNECTION = 'BLOCK_UNTIL_WAIT_INTERNET_CONNECTION';

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
    allowBackButton: boolean;
    showAttempts: boolean;
    hasInternetConnection: boolean;
    isMoonletDisabled: boolean;
    currentDate: Date;
}

export interface IReduxProps {
    changePIN: typeof changePIN;
    failedLogins: number;
    blockUntil: Date | string;
    biometricActive: boolean;
    incrementFailedLogins: typeof incrementFailedLogins;
    resetFailedLogins: typeof resetFailedLogins;
    setAppBlockUntil: typeof setAppBlockUntil;
    resetAllData: typeof resetAllData;
    setDisplayPasswordModal: typeof setDisplayPasswordModal;
}

export const mapStateToProps = (state: IReduxState) => ({
    failedLogins: state.app.failedLogins,
    blockUntil: state.app.blockUntil,
    biometricActive: state.preferences.touchID
});

export const mapDispatchToProps = {
    changePIN,
    incrementFailedLogins,
    resetFailedLogins,
    setAppBlockUntil,
    resetAllData,
    setDisplayPasswordModal
};

export class PasswordModalComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static refDeferred: Deferred<PasswordModalComponent> = new Deferred();
    private modalOnHideDeffered: Deferred;
    private resultDeferred: Deferred;

    private countdownListener;
    private netInfoListener;
    private passwordPin;
    private fetchCurrentDate;

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
            errorMessage: undefined,
            allowBackButton: false,
            showAttempts: false,
            hasInternetConnection: false,
            isMoonletDisabled: false,
            currentDate: undefined
        };
    }

    public componentDidMount() {
        if (
            moment(new Date(this.props.blockUntil)).isValid() ||
            this.props.blockUntil === BLOCK_UNTIL_WAIT_INTERNET_CONNECTION
        ) {
            this.setState({ isMoonletDisabled: true });

            // Use fetch here because NetInfo listener with setInterval needs 1 sec to load
            NetInfo.fetch().then(state => {
                if (state.isConnected === false) {
                    this.setState({ isMoonletDisabled: true });
                }
            });
        }

        this.setNetInfoListener();
    }

    private setNetInfoListener() {
        this.netInfoListener = NetInfo.addEventListener(state => {
            this.setState({ hasInternetConnection: state.isConnected });
            if (state.isConnected === false && this.props.blockUntil) {
                // Disable Moonlet because Device has NO internet connection and blockUntil is set
                this.setState({ isMoonletDisabled: true });
                clearInterval(this.countdownListener);
            } else {
                // Device has internet connection

                if (this.props.blockUntil) {
                    if (this.props.blockUntil === BLOCK_UNTIL_WAIT_INTERNET_CONNECTION) {
                        // Block until is not set
                        // Fetch current date until we have a date from server in order to set block until
                        this.handleAppBlock();
                    } else {
                        // Block until is set with the proper date
                        // Start Countdown
                        this.setCountdownListener();
                    }
                }
            }
        });
    }

    private getCurrentDate(callback: (date: Date) => void) {
        ntpClient.getNetworkTime(CONFIG.ntpServer, CONFIG.ntpPort, (error: any, date: any) => {
            if (date) {
                const currentDate: Date = new Date(date);
                if (
                    moment(new Date(currentDate)).isValid() &&
                    moment(new Date(currentDate)).year() >= 2020
                ) {
                    this.setState({ currentDate }, () => callback(currentDate));
                } else {
                    this.setState({ currentDate: undefined }, () => callback(undefined));
                }
            } else {
                this.setState({ currentDate: undefined }, () => callback(undefined));
            }
        });
    }

    private setCountdownListener() {
        clearInterval(this.countdownListener);
        this.countdownListener = setInterval(() => {
            this.getCurrentDate((currentDate: Date) => {
                if (moment(currentDate)) {
                    if (
                        this.props.blockUntil &&
                        moment
                            .duration(moment(this.props.blockUntil).diff(moment(currentDate)))
                            .asSeconds() > 0
                    ) {
                        // Show countdown
                        this.setState({ isMoonletDisabled: true });
                    } else {
                        // Close countdown, enable Moonlet
                        this.setState({ isMoonletDisabled: false, currentDate: undefined });
                        this.props.setAppBlockUntil(undefined); // Reset app block until
                        if (this.countdownListener) {
                            clearInterval(this.countdownListener); // Clear countdown listener
                        }
                        this.clearErrorMessage();
                    }
                } else {
                    // Disable Moonlet because NTP date is undefined
                    this.setState({ isMoonletDisabled: true });
                }
            });
        }, 2000); // NTP fetch may take longer in some cases
    }

    public componentWillUnmount() {
        clearInterval(this.countdownListener);
        this.netInfoListener();
        clearInterval(this.fetchCurrentDate);
    }

    public static async getPassword(
        title?: string,
        subtitle?: string,
        data?: { shouldCreatePassword?: boolean }
    ) {
        const ref = await PasswordModalComponent.refDeferred.promise;
        return ref.getPassword(title, subtitle, data);
    }

    public static async createPassword() {
        const ref = await PasswordModalComponent.refDeferred.promise;
        return ref.createPassword();
    }

    public static async changePassword() {
        const ref = await PasswordModalComponent.refDeferred.promise;
        return ref.changePassword();
    }

    public static async isVisible() {
        const ref = await PasswordModalComponent.refDeferred.promise;
        return ref.isVisible();
    }

    public isVisible(): boolean {
        return this.state.visible;
    }

    public async getPassword(
        title: string,
        subtitle: string,
        data: { shouldCreatePassword?: boolean }
    ): Promise<string> {
        this.resultDeferred = new Deferred();

        if (data?.shouldCreatePassword) {
            const password = await getBaseEncryptionKey();
            if (password === null) {
                this.resultDeferred && this.resultDeferred.reject();
            }
        }

        this.clearErrorMessage();

        this.modalOnHideDeffered = new Deferred();
        this.setState({
            visible: true,
            title: title || translate('Password.pinTitleUnlock'),
            subtitle: subtitle || translate('Password.pinSubtitleUnlock'),
            currentStep: ScreenStep.ENTER_PIN,
            allowBackButton: false,
            showAttempts: true
        });

        return this.resultDeferred.promise;
    }

    public createPassword() {
        this.resultDeferred = new Deferred();
        this.clearErrorMessage();

        this.modalOnHideDeffered = new Deferred();
        this.setState({
            visible: true,
            title: translate('Password.setupPinTitle'),
            subtitle: translate('Password.setupPinSubtitle'),
            currentStep: ScreenStep.CREATE_PIN_TERMS,
            allowBackButton: true,
            showAttempts: false
        });

        return this.resultDeferred.promise;
    }

    public changePassword() {
        this.resultDeferred = new Deferred();
        this.clearErrorMessage();

        this.modalOnHideDeffered = new Deferred();
        this.setState({
            visible: true,
            title: translate('Password.pinTitleUnlock'),
            subtitle: translate('Password.changePinSubtitle'),
            currentStep: ScreenStep.CHANGE_PIN_TERMS,
            allowBackButton: true,
            showAttempts: true
        });

        return this.resultDeferred.promise;
    }

    private async onBackButtonTap() {
        this.setState({ visible: false });
        await this.modalOnHideDeffered?.promise;
        this.resultDeferred?.reject();
    }

    private clearErrorMessage() {
        this.setState({ errorMessage: undefined });
    }

    private handlePasswordAttempts() {
        const failedLoginBlocking = Object.keys(FAILED_LOGIN_BLOCKING)
            .concat(String(RESET_APP_FAILED_LOGINS))
            .sort((a: any, b: any) => b - a);

        let index = 0;
        failedLoginBlocking.map((failedLogin, i) => {
            if (this.props.failedLogins <= Number(failedLogin)) {
                index = i;
            }
        });

        const attempts: number = Number(failedLoginBlocking[index]) - this.props.failedLogins;

        if (this.props.failedLogins === RESET_APP_FAILED_LOGINS - 1) {
            // last attempt before erasing all the data
            this.setState({
                errorMessage: translate('Password.invalidPasswordLastAttempt')
            });
        } else {
            this.setState({
                errorMessage: translate('Password.invalidPasswordAtttempts', { attempts }, attempts)
            });
        }
    }

    private setAppBlockUntil(currentDate: Date, failedLoginBlocking: number) {
        // if (moment(new Date(currentDate)).isValid()) {
        this.props.setAppBlockUntil(
            new Date(new Date(currentDate).getTime() + failedLoginBlocking)
        );

        clearInterval(this.fetchCurrentDate);

        // Start Countdown
        this.setCountdownListener();
        // }
    }

    private async handleAppBlock() {
        const failedLoginBlocking = FAILED_LOGIN_BLOCKING[this.props.failedLogins];
        if (failedLoginBlocking) {
            // Disable Moonlet
            this.setState({ isMoonletDisabled: true });
            this.getCurrentDate((currentDate: Date) => {
                if (moment(new Date(currentDate)).isValid()) {
                    this.setAppBlockUntil(currentDate, failedLoginBlocking);
                } else {
                    // If the app is blocked wihtout any internet connection
                    // If you close and open again the app, the need a flag to detect that the app has been already blocked
                    this.props.setAppBlockUntil(BLOCK_UNTIL_WAIT_INTERNET_CONNECTION);

                    // Fetch current date until we have a date from server
                    clearInterval(this.fetchCurrentDate);
                    this.fetchCurrentDate = setInterval(() => {
                        this.getCurrentDate((_currentDate: Date) => {
                            if (moment(new Date(_currentDate)).isValid()) {
                                this.setAppBlockUntil(_currentDate, failedLoginBlocking);
                            }
                        });
                    }, 1000);
                }
            });
        }
    }

    private async handleWrongPassword() {
        if (this.state.showAttempts) {
            this.props.incrementFailedLogins();
            this.handlePasswordAttempts();
            this.handleAppBlock();

            if (this.props.failedLogins === RESET_APP_FAILED_LOGINS) {
                NavigationService.popToTop();
                NavigationService.navigate('OnboardingNavigation', {});
                this.setState({ visible: false });
                await this.modalOnHideDeffered?.promise;
                this.props.resetAllData();
                this.props.resetFailedLogins();
            }
        } else {
            this.setState({ errorMessage: translate('Password.invalidPassword') });
        }
    }

    @bind
    private async updateState(data: { password?: string }) {
        const shouldConsiderBiometric = data.password === '' ? this.props.biometricActive : false;
        switch (this.state.currentStep) {
            // Enter PIN Flow
            case ScreenStep.ENTER_PIN:
                let password = data.password;
                if (shouldConsiderBiometric) {
                    password = await getPinCode();
                }
                const isPasswordValid = await this.verifyPassword(password);
                if (isPasswordValid) {
                    this.setState({ visible: false });
                    this.props.resetFailedLogins();
                    this.props.setAppBlockUntil(undefined);
                    await this.modalOnHideDeffered.promise;
                    this.resultDeferred?.resolve(password);
                } else if (shouldConsiderBiometric === false) {
                    this.handleWrongPassword();
                }
                break;

            // Create PIN Flow
            case ScreenStep.CREATE_PIN_TERMS:
                this.setState({ currentStep: ScreenStep.CREATE_PIN });
                break;
            case ScreenStep.CREATE_PIN:
                this.passwordPin.clearPasswordInput();
                this.setState({
                    currentStep: ScreenStep.CREATE_PIN_CONFIRM,
                    password: data.password,
                    title: translate('Password.verifyPinTitle'),
                    subtitle: translate('Password.verifyPinSubtitle')
                });
                break;
            case ScreenStep.CREATE_PIN_CONFIRM:
                if (this.state.password === data.password) {
                    this.setState({ visible: false });
                    await generateEncryptionKey(data.password);
                    if (this.props.biometricActive) await setPinCode(data.password);
                    await this.modalOnHideDeffered?.promise;
                    this.resultDeferred?.resolve(data.password);
                } else {
                    this.handleWrongPassword();
                }
                break;

            // Change PIN Flow
            case ScreenStep.CHANGE_PIN_TERMS:
                this.setState({ currentStep: ScreenStep.CHANGE_PIN_CURRENT });
                break;
            case ScreenStep.CHANGE_PIN_CURRENT:
                const passwordValid = await this.verifyPassword(data.password);
                if (passwordValid) {
                    this.passwordPin.clearPasswordInput();
                    this.setState({
                        currentStep: ScreenStep.CHANGE_PIN_NEW,
                        password: data.password,
                        title: translate('Password.setupPinTitle'),
                        subtitle: translate('Password.setupPinSubtitle')
                    });
                } else {
                    if (shouldConsiderBiometric === false) {
                        this.handleWrongPassword();
                    }
                }
                break;
            case ScreenStep.CHANGE_PIN_NEW:
                this.passwordPin.clearPasswordInput();
                if (this.state.password === data.password) {
                    // Cannot change PIN with the same PIN
                    this.setState({ errorMessage: translate('Password.alreadyHavePin') });
                } else {
                    // Confirm new Pin
                    this.setState({
                        currentStep: ScreenStep.CHANGE_PIN_CONFIRM,
                        title: translate('Password.verifyPinTitle'),
                        subtitle: translate('Password.verifyPinSubtitle'),
                        newPassword: data.password,
                        showAttempts: false // disable wipe data
                    });
                }
                break;
            case ScreenStep.CHANGE_PIN_CONFIRM:
                if (this.state.newPassword === data.password) {
                    // Save new PIN in storage
                    // this.state.password is the old password
                    this.setState({ visible: false });
                    this.props.changePIN(this.state.newPassword, this.state.password);
                    await generateEncryptionKey(this.state.newPassword);
                    if (this.props.biometricActive) await setPinCode(this.state.newPassword);

                    await this.modalOnHideDeffered?.promise;
                    this.resultDeferred?.resolve(this.state.newPassword);
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
                return await verifyPinCode(value);
            } catch {
                this.setState({ errorMessage: translate('Password.genericError') });
                return false;
            }
        }
    }

    private renderMoonletDisabled() {
        const { styles } = this.props;

        if (this.state.hasInternetConnection) {
            const currentDate = moment(this.state.currentDate);

            let duration = null;
            let timeMeasurement: string;
            let coundownTime: number = 0;
            let showSeconds: boolean = false;

            if (moment(new Date(this.props.blockUntil)).isValid()) {
                duration = moment.duration(
                    moment(new Date(this.props.blockUntil)).diff(currentDate)
                );

                const seconds = Math.floor(duration.asSeconds());
                const minutes = Math.floor(duration.asMinutes());
                const hours = Math.floor(duration.asHours());
                const days = Math.floor(duration.asDays());

                if (days > 0) {
                    timeMeasurement = translate('Time.day', undefined, days);
                    coundownTime = days;
                } else if (hours > 0) {
                    timeMeasurement = translate('Time.hour', undefined, hours);
                    coundownTime = hours;
                } else if (minutes > 0) {
                    timeMeasurement = translate('Time.minute', undefined, minutes);
                    coundownTime = minutes;
                } else {
                    showSeconds = true;

                    if (seconds > 0) {
                        coundownTime = seconds;
                    }
                    timeMeasurement = translate('Time.second', undefined, seconds);
                }
            }

            return (
                <View style={styles.wrongPasswordContainer}>
                    <Text style={styles.moonletDisabled}>
                        {translate('Password.moonletDisabled')}
                    </Text>
                    {timeMeasurement && (
                        <Text style={styles.disabledDetails}>
                            {showSeconds
                                ? translate('Password.disabledDetailsSeconds')
                                : translate('Password.disabledDetails', {
                                      duration: coundownTime,
                                      measurement: timeMeasurement
                                  })}
                        </Text>
                    )}
                </View>
            );
        } else {
            return (
                <View style={styles.wrongPasswordContainer}>
                    <Text style={styles.moonletDisabled}>
                        {translate('Password.moonletDisabled')}
                    </Text>
                    <Text style={styles.disabledDetails}>
                        {translate('Password.activateInternet')}
                    </Text>
                </View>
            );
        }
    }

    public render() {
        return (
            <Modal
                isVisible={this.state.visible}
                animationInTiming={5}
                animationOutTiming={5}
                onModalHide={() => this.modalOnHideDeffered?.resolve()}
            >
                {this.state.currentStep === ScreenStep.CREATE_PIN_TERMS ||
                this.state.currentStep === ScreenStep.CHANGE_PIN_TERMS ? (
                    <PasswordTerms
                        onAcknowledged={() => this.updateState({})}
                        allowBackButton={this.state.allowBackButton}
                        onBackButtonTap={() => this.onBackButtonTap()}
                    />
                ) : (
                    <PasswordPin
                        obRef={ref => (this.passwordPin = ref)}
                        title={this.state.title}
                        subtitle={this.state.subtitle}
                        onPasswordEntered={this.updateState}
                        errorMessage={this.state.errorMessage}
                        clearErrorMessage={() => this.clearErrorMessage()}
                        allowBackButton={this.state.allowBackButton}
                        onBackButtonTap={() => this.onBackButtonTap()}
                        isMoonletDisabled={this.state.isMoonletDisabled}
                    />
                )}

                {this.state.isMoonletDisabled && this.renderMoonletDisabled()}
            </Modal>
        );
    }
}
