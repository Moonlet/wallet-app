import React from 'react';
import { View, Image, Animated, TouchableOpacity, Platform } from 'react-native';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Icon } from '../../../icon';
import LinearGradient from 'react-native-linear-gradient';
import { BiometryType, biometricAuth } from '../../../../core/biometric-auth/biometric-auth';
import { IReduxState } from '../../../../redux/state';
import { normalize, ICON_SIZE } from '../../../../styles/dimensions';
import { SafeAreaView } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

const digitsLayout = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
const ZERO = 0;
const PASSWORD_LENGTH = 6;

export interface IReduxProps {
    touchID: boolean;
}

export interface IExternalProps {
    obRef: any;
    title: string;
    subtitle: string;
    onPasswordEntered: (data: { password?: string }) => void;
    hideBiometricButton: boolean;
    onBiometricLogin: () => void;
    errorMessage: string;
    clearErrorMessage: () => void;
    allowBackButton: boolean;
    onBackButtonTap: () => void;
}

interface IState {
    password: string;
    biometryType: BiometryType;
    isFillPasswordEnabled: boolean;
    biometricActive: boolean;
}

const mapStateToProps = (state: IReduxState) => ({
    touchID: state.preferences.touchID
});

export class PasswordPinComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private shakeAnimation: Animated.Value;

    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            password: '',
            biometryType: undefined,
            isFillPasswordEnabled: true,
            biometricActive: props.touchID
        };
        this.shakeAnimation = new Animated.Value(0);
        props.obRef && props.obRef(this);
    }

    public async componentDidMount() {
        biometricAuth
            .isSupported()
            .then(biometryType => {
                if (Platform.OS === 'ios') {
                    this.setState({ biometryType });
                }
            })
            .catch(() => {
                //
                this.setState({ biometricActive: false });
            });
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.errorMessage !== prevProps.errorMessage) {
            if (this.props.errorMessage) {
                this.startShake();
            }
        }
    }

    public clearPasswordInput() {
        this.setState({ password: '' });
    }

    public fillPassword(digit: string) {
        if (this.state.isFillPasswordEnabled) {
            this.props.clearErrorMessage();
            if (this.state.password.length < PASSWORD_LENGTH) {
                this.setState({ password: this.state.password.concat(digit) }, async () => {
                    if (this.state.password.length === PASSWORD_LENGTH) {
                        this.props.onPasswordEntered({ password: this.state.password });
                    }
                });
            }
        }
    }

    public startShake() {
        this.setState({ isFillPasswordEnabled: false });
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
        ]).start(() => {
            this.clearPasswordInput();
            this.setState({ isFillPasswordEnabled: true });
        });
    }

    public renderInputDots() {
        const { styles } = this.props;
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

    public renderRow(rowValues: any, row: number) {
        const { styles } = this.props;
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
    }

    public renderFooterRow() {
        const styles = this.props.styles;
        const isBiometryAuth =
            !this.props.hideBiometricButton &&
            this.state.biometricActive &&
            DeviceInfo.getManufacturerSync() !== 'OnePlus';

        return (
            <View style={styles.keyRow}>
                <TouchableOpacity
                    style={styles.keyContainer}
                    onPress={() => {
                        if (isBiometryAuth) {
                            this.props.onBiometricLogin();
                        } else {
                            this.setState({ password: '' });
                            this.props.clearErrorMessage();
                        }
                    }}
                >
                    {isBiometryAuth ? (
                        <Icon
                            name={
                                Platform.OS === 'ios' && this.state.biometryType === 'FaceID'
                                    ? 'face-id'
                                    : 'touch-id'
                            }
                            size={normalize(40)}
                            style={styles.touchIdIcon}
                        />
                    ) : (
                        <Text style={styles.reset}>{translate('App.labels.reset')}</Text>
                    )}
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
                        this.setState({ password: this.state.password.slice(0, -1) });
                        this.props.clearErrorMessage();
                    }}
                >
                    <Icon name="keyboard-delete-1" size={normalize(40)} style={styles.deleteIcon} />
                </TouchableOpacity>
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
                <Image
                    style={styles.logoImage}
                    source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                />
                {this.props.allowBackButton && (
                    <TouchableOpacity
                        onPress={() => this.props.onBackButtonTap()}
                        style={styles.backIconContainer}
                    >
                        <Icon name="close" size={ICON_SIZE} style={styles.backIcon} />
                    </TouchableOpacity>
                )}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.subTitle}>{this.props.subtitle}</Text>
                    {this.renderInputDots()}

                    <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
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
            </SafeAreaView>
        );
    }
}

export const PasswordPin = smartConnect<IExternalProps>(PasswordPinComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
