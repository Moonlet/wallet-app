import React from 'react';
import { View, Modal, TouchableHighlight, TextInput, Platform } from 'react-native';
import { translate } from '../../core/i18n';
import Icon from '../icon';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { Button, Text } from '../../library';
import { HeaderLeft } from '../header-left/header-left';
import { Deferred } from '../../core/utils/deferred';
import { smartConnect } from '../../core/utils/smart-connect';
import bind from 'bind-decorator';

const STATUSBAR_HEIGHT = Platform.select({
    ios: 20,
    default: 0
});

export interface IProps {
    visible: boolean;
    infoText: string;
    buttonLabel: string;
    obRef: any;
}

interface IState {
    password: string;
    visible: boolean;
    revealPassword: boolean;
    errorMessage: string;
}

export class PasswordModalComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public onReject: any;
    public onConfirm: any;
    private passwordRequestDeferred;

    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            password: '',
            revealPassword: false,
            visible: !!props.visible || false,
            errorMessage: ''
        };

        props.obRef && props.obRef(this);
    }

    public requestPassword(): Promise<string> {
        this.passwordRequestDeferred = new Deferred();
        this.setState({ visible: true });
        return this.passwordRequestDeferred.promise;
    }

    @bind
    public onEnterPassword() {
        // validate password
        if (this.state.password !== 'pass') {
            this.setState({
                errorMessage: translate('Wallets.invalidPassword')
            });

            return;
        }

        this.passwordRequestDeferred && this.passwordRequestDeferred.resolve(this.state.password);
        this.setState({
            visible: false
        });
    }

    public render() {
        return (
            <Modal
                animationType="none"
                transparent={false}
                visible={this.state.visible}
                presentationStyle={'overFullScreen'}
            >
                {
                    // TODO check for a solution to integrate the react-navigation header
                    // https://github.com/react-navigation/stack/blob/1.0/src/views/Header/Header.tsx
                }
                <View
                    style={{
                        marginTop: STATUSBAR_HEIGHT + 36,
                        zIndex: 2
                    }}
                >
                    <HeaderLeft
                        icon="close"
                        text={translate('App.labels.close')}
                        onPress={() => {
                            this.setState({
                                visible: false
                            });
                            this.passwordRequestDeferred && this.passwordRequestDeferred.reject();
                        }}
                    />
                </View>
                <View style={this.props.styles.container}>
                    <View style={this.props.styles.topContainer}>
                        <Text large style={{ textAlign: 'center' }}>
                            {this.props.infoText}
                        </Text>
                        <View style={this.props.styles.inputBox}>
                            <TextInput
                                testID="input-password"
                                style={this.props.styles.input}
                                placeholderTextColor={this.props.theme.colors.textSecondary}
                                placeholder={translate('SetPassword.password')}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                selectionColor={this.props.theme.colors.accent}
                                secureTextEntry={!this.state.revealPassword}
                                value={this.state.password}
                                onChangeText={password => {
                                    this.setState({
                                        password
                                    });
                                }}
                            />
                            <TouchableHighlight
                                testID="reveal-password"
                                onPress={() => {
                                    this.setState({
                                        revealPassword: !this.state.revealPassword
                                    });
                                }}
                            >
                                <Icon
                                    name={this.state.revealPassword ? 'view-1' : 'view-off'}
                                    size={18}
                                    style={this.props.styles.icon}
                                />
                            </TouchableHighlight>
                        </View>
                        <Text small style={this.props.styles.errorMessage}>
                            {this.state.errorMessage}
                        </Text>
                    </View>
                    <View style={this.props.styles.bottomContainer}>
                        <Button
                            style={this.props.styles.bottomButton}
                            primary
                            onPress={this.onEnterPassword}
                        >
                            {this.props.buttonLabel}
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }
}

export const PasswordModal = smartConnect<IProps>(PasswordModalComponent, [
    withTheme(stylesProvider)
]);
