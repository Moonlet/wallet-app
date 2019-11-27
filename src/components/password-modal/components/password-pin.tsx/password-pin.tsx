import React from 'react';
import { View, TextInput } from 'react-native';
import { translate } from '../../../../core/i18n';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { Button, Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { hash } from '../../../../core/secure/encrypt';

export interface IExternalProps {
    title: string;
    subtitle: string;
    onPasswordEntered: (value: string) => any;
}

interface IState {
    password: string;
    errorMessage: string;
}

export class PasswordPinComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public onReject: any;
    public onConfirm: any;

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            password: '',
            errorMessage: ''
        };
    }

    public onEnterPassword = async () => {
        try {
            const passHash = await hash(this.state.password);
            const resultVerificationPass = await this.props.onPasswordEntered(passHash);
            if (resultVerificationPass !== undefined) {
                this.setState({
                    errorMessage: resultVerificationPass
                });
            }
        } catch {
            this.setState({
                errorMessage: translate('Password.genericError')
            });
        }
    };

    public render() {
        return (
            <View style={this.props.styles.container}>
                <View style={this.props.styles.topContainer}>
                    <Text large style={{ textAlign: 'center' }}>
                        {this.props.title}
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
                            value={this.state.password}
                            onChangeText={password => {
                                this.setState({
                                    password
                                });
                            }}
                        />
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
                        {this.props.subtitle}
                    </Button>
                </View>
            </View>
        );
    }
}

export const PasswordPin = smartConnect<IExternalProps>(PasswordPinComponent, [
    withTheme(stylesProvider)
]);
