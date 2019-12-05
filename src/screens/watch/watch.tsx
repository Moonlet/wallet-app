import React from 'react';
import { View, TextInput, Clipboard } from 'react-native';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { IReduxState } from '../../redux/state';
import { translate } from '../../core/i18n';

import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { HeaderLeft } from '../../components/header-left/header-left';
import { KeyboardCustom } from '../../components/keyboard-custom/keyboard-custom';
import { Notification } from '../../messaging/notifications';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Button } from '../../library';

interface IState {
    textInput: any;
}

export const mapStateToProps = (state: IReduxState) => {
    return {};
};

export const navigationOptions = () => ({
    headerLeft: <HeaderLeft icon="saturn-icon" />,
    title: translate('App.labels.watch')
});

export class WatchScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            textInput: ''
        };
    }

    public handleTextUpdate = (text: any) => {
        this.setState({
            textInput: this.state.textInput + text
        });
    };

    public handleDeleteKey = () => {
        this.setState({
            textInput: this.state.textInput.slice(0, -1)
        });
    };

    public getCurrentToken = () => {
        Notification.getToken().then(token => {
            Clipboard.setString(token);
        });
    };

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={styles.textInputArea}>
                    <TextInput value={this.state.textInput} editable={false} style={styles.text} />
                </View>
                <Button onPress={this.getCurrentToken}>
                    <Text>Copy fb token</Text>
                </Button>
                <KeyboardCustom
                    showNumeric={true}
                    handleTextUpdate={this.handleTextUpdate}
                    handleDeleteKey={this.handleDeleteKey}
                    buttons={[
                        {
                            label: 'Paste',
                            onPress: () => true
                        },
                        {
                            label: 'Confirm',
                            onPress: () => true,
                            style: { color: this.props.theme.colors.accent }
                        }
                    ]}
                    footerButton={{
                        label: 'Next Word',
                        onPress: () => true
                    }}
                />
            </View>
        );
    }
}

export const WatchScreen = smartConnect(WatchScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
