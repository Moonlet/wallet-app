import React from 'react';
import { View, TextInput } from 'react-native';
import { Button } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { INavigationProps } from '../../navigation/with-navigation-params';

interface IState {
    address: string;
    symbol: string; // TOKEN
    decimals: string;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: navigation.state?.params?.token
        ? translate('App.labels.editToken')
        : translate('App.labels.addToken')
});

export class ManageTokenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            address: this.props.navigation.state?.params?.token.address || undefined,
            symbol: this.props.navigation.state?.params?.token.symbol || undefined,
            decimals: this.props.navigation.state?.params?.token.decimals || undefined
        };
    }

    public render() {
        const { styles, theme } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={theme.colors.textTertiary}
                            placeholder={translate('App.labels.contractAddress')}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            selectionColor={theme.colors.accent}
                            value={this.state.address}
                            onChangeText={value => this.setState({ address: value })}
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={theme.colors.textTertiary}
                            placeholder={translate('App.labels.symbol')}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            selectionColor={theme.colors.accent}
                            value={this.state.symbol}
                            onChangeText={value => this.setState({ symbol: value })}
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={theme.colors.textTertiary}
                            placeholder={translate('App.labels.decimals')}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            keyboardType="decimal-pad"
                            selectionColor={theme.colors.accent}
                            value={this.state.decimals}
                            onChangeText={value => this.setState({ decimals: value })}
                        />
                    </View>
                </View>

                <Button
                    style={styles.saveButton}
                    onPress={() => {
                        //
                    }}
                >
                    {translate('App.labels.save')}
                </Button>
            </View>
        );
    }
}

export const ManageTokenScreen = smartConnect(ManageTokenComponent, [withTheme(stylesProvider)]);
