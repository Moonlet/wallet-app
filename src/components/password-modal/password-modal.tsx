import React from 'react';
import { View, Modal, TouchableHighlight, TextInput, Platform } from 'react-native';
import { translate } from '../../core/i18n';
import Icon from '../icon';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { Button, Text } from '../../library';
import { HeaderLeft } from '../header-left/header-left';
import { ITheme } from '../../core/theme/itheme';

const STATUSBAR_HEIGHT = Platform.select({
    ios: 20,
    default: 0
});

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
    visible: boolean;
    infoText: string;
    buttonLabel: string;
    onReject: any;
    onConfirm: any;
    obRef: any;
}

interface IState {
    password: string;
    revealPassword: boolean;
}

export class PasswordModalComponent extends React.Component<IProps, IState> {
    public onReject: any;
    public onConfirm: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            password: '',
            revealPassword: false
        };

        props.onReject && (this.onReject = props.onReject);
        props.onConfirm && (this.onConfirm = props.onConfirm);

        props.obRef && props.obRef(this);
    }

    public requestPassword(callback) {
        this.onConfirm = callback;
    }

    public render() {
        return (
            <Modal
                animationType="none"
                transparent={false}
                visible={!!this.props.visible}
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
                            this.onReject && this.onReject();
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
                    </View>
                    <View style={this.props.styles.bottomContainer}>
                        <Button
                            style={this.props.styles.bottomButton}
                            primary
                            onPress={() => {
                                this.onConfirm && this.onConfirm(this.state.password);
                            }}
                        >
                            {this.props.buttonLabel}
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }
}

export const PasswordModal = withTheme(stylesProvider)(PasswordModalComponent);
