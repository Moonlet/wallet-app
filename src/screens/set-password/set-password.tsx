import React, { useState } from 'react';
import { View, TouchableHighlight, TextInput } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Text } from '../../library';
import { ITheme } from '../../core/theme/itheme';
import { Icon } from '../../components/icon';
import { translate } from '../../core/i18n';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{10,}$/;

export const SetPasswordScreenComponent = (props: IProps) => {
    const [revealPassword, setRevealPassword] = useState({ password: false, confirm: false });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorText, setErrorText] = useState('');

    return (
        <View style={props.styles.container}>
            <View style={props.styles.topContainer}>
                <Text darker style={{ textAlign: 'center', marginTop: 60 }}>
                    {translate('SetPassword.body')}
                </Text>
                {errorText !== '' && (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>{errorText}</Text>
                )}
                <View style={props.styles.inputBox}>
                    <TextInput
                        testID="input-password"
                        style={props.styles.input}
                        placeholderTextColor={props.theme.colors.textSecondary}
                        placeholder={translate('SetPassword.password')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={props.theme.colors.accent}
                        secureTextEntry={!revealPassword.password}
                        value={password}
                        onChangeText={text => {
                            setPassword(text);
                        }}
                    />
                    <TouchableHighlight
                        testID="reveal-password"
                        onPress={() => {
                            setRevealPassword({
                                ...revealPassword,
                                ...{ password: !revealPassword.password }
                            });
                        }}
                    >
                        <Icon
                            name={revealPassword.password ? 'view-1' : 'view-off'}
                            size={18}
                            style={props.styles.icon}
                        />
                    </TouchableHighlight>
                </View>

                <View style={props.styles.inputBox}>
                    <TextInput
                        testID="input-confirm-password"
                        style={props.styles.input}
                        placeholderTextColor={props.theme.colors.textSecondary}
                        placeholder={translate('SetPassword.confirmPassword')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={props.theme.colors.accent}
                        secureTextEntry={!revealPassword.confirm}
                        value={confirmPassword}
                        onChangeText={text => {
                            setConfirmPassword(text);
                        }}
                    />
                    <TouchableHighlight
                        testID="reveal-confirm-password"
                        onPress={() => {
                            setRevealPassword({
                                ...revealPassword,
                                ...{ confirm: !revealPassword.confirm }
                            });
                        }}
                    >
                        <Icon
                            name={revealPassword.confirm ? 'view-1' : 'view-off'}
                            size={18}
                            style={props.styles.icon}
                        />
                    </TouchableHighlight>
                </View>
            </View>
            <View style={props.styles.bottomContainer}>
                <Button
                    testID="button-understand"
                    style={props.styles.bottomButton}
                    primary
                    onPress={() => {
                        if (password !== confirmPassword) {
                            setErrorText(translate('SetPassword.errors.passwordsDontMatch'));
                            return;
                        }

                        if (!passwordStrengthRegex.test(password)) {
                            setErrorText(translate('Password.invalidPassword'));
                            return;
                        }

                        // props.navigation.navigate('');
                    }}
                >
                    {translate('App.labels.secure')}
                </Button>
            </View>
        </View>
    );
};

const navigationOptions = () => ({
    title: translate('Wallets.secureWallet')
});

export const SetPasswordScreen = withTheme(stylesProvider)(SetPasswordScreenComponent);

SetPasswordScreen.navigationOptions = navigationOptions;
