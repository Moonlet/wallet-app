import React from 'react';
import { View, Image, Animated, TouchableOpacity } from 'react-native';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { hash } from '../../../../core/secure/encrypt';
import { Icon } from '../../../icon';
import LinearGradient from 'react-native-linear-gradient';

export interface IExternalProps {
    title: string;
    subtitle: string;
    onPasswordEntered: (value: string) => any;
}

interface IState {
    password: string;
    title: string;
    subtitle: string;
    errorMessage: string;
    passToVerify: string;
}

const digitsLayout = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
const ZERO = 0;
const PASSWORD_LENGTH = 6;

export class PasswordPinComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.title !== prevState.title) {
            return {
                password: '',
                title: nextProps.title,
                subtitle: nextProps.subtitle,
                errorMessage: '',
                passToVerify: prevState.password // save the password to compare it
            };
        } else {
            return null;
        }
    }
    public onReject: any;
    public onConfirm: any;
    private shakeAnimation: any;

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            password: '',
            errorMessage: '',
            title: props.title,
            subtitle: props.subtitle,
            passToVerify: ''
        };
        this.shakeAnimation = new Animated.Value(0);
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
        if (this.state.password.length < 6) {
            this.setState({ password: this.state.password.concat(digit) }, () => {
                if (this.state.password.length === PASSWORD_LENGTH) {
                    this.onEnterPassword();
                }
            });
        }
    }

    public renderRow = (rowValues: any) => {
        const styles = this.props.styles;

        return (
            <View style={styles.keyRow}>
                {rowValues.map((digit: string, index: any) => {
                    return (
                        <LinearGradient
                            key={index}
                            colors={this.props.theme.shadowGradient}
                            start={{ x: 0.0, y: 1.0 }}
                            end={{ x: 1.0, y: 0.0 }}
                            style={{ flex: 1 }}
                        >
                            <TouchableOpacity
                                key={index}
                                style={styles.keyContainer}
                                onPress={() => this.fillPassword(digit)}
                            >
                                <Text style={styles.keyText}>{digit}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    );
                })}
            </View>
        );
    };

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
                        style={
                            this.state.password.charAt(index) === ''
                                ? styles.unchecked
                                : styles.checked
                        }
                    />
                ))}
            </Animated.View>
        );
    }

    public renderFooterRow = () => {
        const styles = this.props.styles;

        return (
            <View style={styles.keyRow}>
                <LinearGradient
                    colors={this.props.theme.shadowGradient}
                    start={{ x: 0.0, y: 1.0 }}
                    end={{ x: 1.0, y: 0.0 }}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity
                        style={styles.keyContainer}
                        onPress={() => {
                            // show touch id
                        }}
                    >
                        <Icon name="touch-id" size={40} style={styles.icon} />
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={this.props.theme.shadowGradient}
                    start={{ x: 0.0, y: 1.0 }}
                    end={{ x: 1.0, y: 0.0 }}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity
                        style={styles.keyContainer}
                        onPress={() => this.fillPassword(String(ZERO))}
                    >
                        <Text style={styles.keyText}>{ZERO}</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={this.props.theme.shadowGradient}
                    start={{ x: 0.0, y: 1.0 }}
                    end={{ x: 1.0, y: 0.0 }}
                    style={{ flex: 1 }}
                >
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
                </LinearGradient>
            </View>
        );
    };

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.logoImage}
                    // moonlet_space_gray
                    source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                />
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Text style={styles.subTitle}>{this.state.subtitle}</Text>
                    {this.renderInputDots()}

                    <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                </View>

                <View style={styles.digitsLayout}>
                    {this.renderRow(digitsLayout[0])}
                    {/* <LinearGradient
                        colors={this.props.theme.shadowGradient}
                        locations={[0, 0.5]}
                        style={styles.selectorGradientContainer}
                    >
                        <View></View>
                    </LinearGradient> */}
                    {this.renderRow(digitsLayout[1])}
                    {this.renderRow(digitsLayout[2])}
                    {this.renderFooterRow()}
                </View>
            </View>
        );
    }
}

export const PasswordPin = smartConnect<IExternalProps>(PasswordPinComponent, [
    withTheme(stylesProvider)
]);
