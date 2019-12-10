import React from 'react';
import { View, Image, Animated, TouchableOpacity } from 'react-native';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { hash } from '../../../../core/secure/encrypt';
import { Icon } from '../../../icon';
import LinearGradient from 'react-native-linear-gradient';
import TouchID from 'react-native-touch-id';
import { IReduxState } from '../../../../redux/state';

export interface IReduxProps {
    touchID: boolean;
}

export interface IExternalProps {
    title: string;
    subtitle: string;
    updatePinProps: boolean;
    onPasswordEntered: (value: string) => Promise<string>;
    onBiometryLogin: (success: boolean) => void;
}

interface IState {
    password: string;
    errorMessage: string;
    passToVerify: string;
}

const mapStateToProps = (state: IReduxState) => ({
    touchID: state.preferences.touchID
});

const digitsLayout = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
const ZERO = 0;
const PASSWORD_LENGTH = 6;

export class PasswordPinComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.updatePinProps === true) {
            return {
                password: '',
                errorMessage: '',
                passToVerify: prevState.password // save the password to compare it
            };
        } else {
            return null;
        }
    }
    private shakeAnimation: Animated.Value;

    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            password: '',
            errorMessage: '',
            passToVerify: ''
        };
        this.shakeAnimation = new Animated.Value(0);

        this.biometryAuth();
    }

    public async onEnterPassword() {
        if (this.state.passToVerify !== '' && this.state.passToVerify !== this.state.password) {
            this.setState({
                errorMessage: translate('Password.dontMatch'),
                password: ''
            });
            return;
        }
        try {
            const passHash = await hash(this.state.password);
            const resultVerificationPass = await this.props.onPasswordEntered(passHash);
            if (resultVerificationPass !== undefined) {
                this.setState({
                    errorMessage: resultVerificationPass,
                    password: ''
                });
                this.startShake();
            }
        } catch {
            this.startShake();
            this.setState({
                errorMessage: translate('Password.genericError'),
                password: ''
            });
        }
    }

    public fillPassword(digit: string) {
        if (this.state.errorMessage !== '') {
            this.setState({
                errorMessage: ''
            });
        }
        if (this.state.password.length < PASSWORD_LENGTH) {
            this.setState({ password: this.state.password.concat(digit) }, () => {
                if (this.state.password.length === PASSWORD_LENGTH) {
                    this.onEnterPassword();
                }
            });
        }
    }

    public startShake() {
        Animated.sequence([
            Animated.timing(this.shakeAnimation, {
                toValue: 20,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(this.shakeAnimation, {
                toValue: -20,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(this.shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(this.shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(this.shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(this.shakeAnimation, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true
            })
        ]).start();
    }

    public renderInputDots() {
        const styles = this.props.styles;
        return (
            <Animated.View
                style={[styles.inputRow, { transform: [{ translateX: this.shakeAnimation }] }]}
            >
                {[...Array(PASSWORD_LENGTH)].map((c, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pinInput,
                            this.state.password.charAt(index) === ''
                                ? styles.unchecked
                                : styles.checked
                        ]}
                    />
                ))}
            </Animated.View>
        );
    }
    public renderRow = (rowValues: any, row: number) => {
        const styles = this.props.styles;

        return (
            <View style={styles.keyRow}>
                {rowValues.map((digit: string, index: any) => {
                    return [
                        <TouchableOpacity
                            key={index}
                            style={styles.keyContainer}
                            onPress={() => this.fillPassword(digit)}
                        >
                            <Text style={styles.keyText}>{digit}</Text>
                        </TouchableOpacity>,
                        [0, 1].indexOf(index) >= 0 ? (
                            <LinearGradient
                                key={'gradient' + index}
                                colors={
                                    row === 0
                                        ? [
                                              this.props.theme.colors.gradientLight,
                                              this.props.theme.colors.gradientDark
                                          ]
                                        : [
                                              this.props.theme.colors.gradientDark,
                                              this.props.theme.colors.gradientDark
                                          ]
                                }
                                locations={row === 0 ? [0.5, 0.67] : [0, 1]}
                                style={styles.gradientRowContainer}
                            />
                        ) : null
                    ];
                })}
            </View>
        );
    };

    public biometryAuth = () => {
        if (this.props.touchID) {
            TouchID.isSupported()
                .then(biometryType => this.authenticate())
                .catch(error => {
                    // Failure code if the user's device does not have touchID or faceID enabled
                });
        }
    };

    public authenticate() {
        const { theme } = this.props;

        const touchIDConfig = {
            title: translate('Password.authRequired'),
            imageColor: theme.colors.accent,
            imageErrorColor: theme.colors.error,
            sensorDescription: translate('Password.touchSensor'),
            sensorErrorDescription: translate('App.labels.failed'),
            cancelText: translate('App.labels.cancel'),
            fallbackLabel: translate('Password.showPasscode'),
            passcodeFallback: false
        };

        return TouchID.authenticate(translate('Password.authToContinue'), touchIDConfig)
            .then((success: boolean) => {
                if (success) {
                    this.props.onBiometryLogin(true);
                }
            })
            .catch(error => {
                //
            });
    }

    public renderFooterRow = () => {
        const styles = this.props.styles;

        return (
            <View style={styles.keyRow}>
                <TouchableOpacity style={styles.keyContainer} onPress={this.biometryAuth}>
                    <Icon name="touch-id" size={40} style={styles.icon} />
                </TouchableOpacity>
                <LinearGradient
                    colors={[
                        this.props.theme.colors.gradientDark,
                        this.props.theme.colors.gradientLight
                    ]}
                    locations={[0.33, 0.5]}
                    style={styles.gradientRowContainer}
                />

                <TouchableOpacity
                    style={styles.keyContainer}
                    onPress={() => this.fillPassword(String(ZERO))}
                >
                    <Text style={styles.keyText}>{ZERO}</Text>
                </TouchableOpacity>
                <LinearGradient
                    colors={[
                        this.props.theme.colors.gradientDark,
                        this.props.theme.colors.gradientLight
                    ]}
                    locations={[0.33, 0.5]}
                    style={styles.gradientRowContainer}
                />
                <TouchableOpacity
                    style={styles.keyContainer}
                    onPress={() => {
                        this.setState({
                            password: this.state.password.slice(0, -1),
                            errorMessage: ''
                        });
                    }}
                >
                    <Icon name="keyboard-delete-1" size={40} style={styles.icon} />
                </TouchableOpacity>
            </View>
        );
    };

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.logoImage}
                    source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                />
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.subTitle}>{this.props.subtitle}</Text>
                    {this.renderInputDots()}

                    <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                </View>

                <View style={styles.digitsLayout}>
                    {this.renderRow(digitsLayout[0], 0)}
                    <LinearGradient
                        colors={[
                            this.props.theme.colors.gradientLight,
                            this.props.theme.colors.gradientDark,
                            this.props.theme.colors.gradientLight
                        ]}
                        locations={[0.16, 0.5, 0.84]}
                        angle={90}
                        useAngle={true}
                        style={styles.selectorGradientContainer}
                    />
                    {this.renderRow(digitsLayout[1], 1)}
                    <LinearGradient
                        colors={[
                            this.props.theme.colors.gradientLight,
                            this.props.theme.colors.gradientDark,
                            this.props.theme.colors.gradientLight
                        ]}
                        locations={[0.16, 0.5, 0.84]}
                        angle={90}
                        useAngle={true}
                        style={styles.selectorGradientContainer}
                    />
                    {this.renderRow(digitsLayout[2], 2)}
                    <LinearGradient
                        colors={[
                            this.props.theme.colors.gradientLight,
                            this.props.theme.colors.gradientDark,
                            this.props.theme.colors.gradientLight
                        ]}
                        locations={[0.16, 0.5, 0.84]}
                        angle={90}
                        useAngle={true}
                        style={styles.selectorGradientContainer}
                    />
                    {this.renderFooterRow()}
                </View>
            </View>
        );
    }
}

export const PasswordPin = smartConnect<IExternalProps>(PasswordPinComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
