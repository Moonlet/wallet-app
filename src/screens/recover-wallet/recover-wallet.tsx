import React from 'react';
import { View, TextInput, ScrollView, Clipboard } from 'react-native';
import { Text } from '../../library';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    NavigationActions
} from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { wordlists } from 'bip39';
import { translate } from '../../core/i18n';
import { HeaderLeft } from '../../components/header-left/header-left';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { TOS_VERSION } from '../../core/constants/app';
import { ITheme } from '../../core/theme/itheme';
import { createHDWallet } from '../../redux/wallets/actions';
import { Mnemonic } from '../../core/wallet/hd-wallet/mnemonic';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

interface IState {
    mnemonic: string[];
    suggestions: string[];
    indexForSuggestions: number;
    errors: number[];
}

export interface IReduxProps {
    tosVersion: number;
    createHDWallet: (mnemonic: string, callback: () => any) => void;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        if (navigation.state && navigation.state.params && navigation.state.params.goBack) {
            return (
                <HeaderLeft
                    icon="arrow-left-1"
                    text="Back"
                    onPress={() => {
                        navigation.state.params.goBack(navigation);
                    }}
                />
            );
        }

        return null;
    },
    title: 'Recover'
});

export class RecoverWalletScreenComponent extends React.Component<IProps & IReduxProps, IState> {
    public static navigationOptions = navigationOptions;
    public suggestionsScrollView: any;
    public inputView: any = [];

    constructor(props: any) {
        super(props);
        this.state = {
            mnemonic: new Array(24).fill(''),
            // mnemonic: 'panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon'.split(' '),
            suggestions: [],
            errors: [],
            indexForSuggestions: -1
        };

        if (!props.tosVersion || TOS_VERSION > props.tosVersion) {
            props.navigation.navigate('CreateWalletTerms');
        }
    }

    // updates text when user types in
    public setMnemonicText(index, text) {
        const mnemonic = this.state.mnemonic.slice();
        mnemonic[index] = text;

        this.setState({
            mnemonic,
            suggestions: this.getSuggestions(text),
            indexForSuggestions: index
        });
    }

    public render() {
        const props = this.props;
        return (
            <View style={props.styles.container}>
                <View style={props.styles.topContainer}>
                    <View style={props.styles.mnemonicContainer}>{this.getInputMatrix()}</View>
                    <ScrollView
                        ref={ref => (this.suggestionsScrollView = ref)}
                        horizontal
                        overScrollMode={'never'}
                        snapToAlignment={'start'}
                        showsHorizontalScrollIndicator={false}
                        style={props.styles.suggestionsContainer}
                    >
                        <View style={{ width: 12 }} />
                        {this.state.suggestions.map((word, i) => (
                            <View key={i}>
                                <Button
                                    secondary
                                    style={props.styles.suggestionButton}
                                    onPress={() => {
                                        this.fillMnemonicText(word);
                                    }}
                                >
                                    {word}
                                </Button>
                            </View>
                        ))}
                        <View style={{ width: 12 }} />
                    </ScrollView>
                </View>
                <View style={props.styles.bottomContainer}>
                    <Button
                        testID="button-paste"
                        style={props.styles.bottomButton}
                        onPress={() => {
                            this.pasteFromClipboard();
                        }}
                    >
                        {translate('App.labels.paste')}
                    </Button>
                    <Button
                        testID="button-next"
                        style={props.styles.bottomButton}
                        disabled={this.state.indexForSuggestions > 22}
                        onPress={() => this.focusInput(this.state.indexForSuggestions + 1)}
                    >
                        {translate('App.labels.next')}
                    </Button>
                    <Button
                        testID="button-confirm"
                        style={props.styles.bottomButton}
                        primary
                        onPress={() => {
                            const errors = [];
                            this.state.mnemonic.forEach((word: string, i: number) => {
                                if (wordlists.EN.indexOf(word) === -1) {
                                    errors.push(i);
                                }
                            });

                            this.setState({ errors });

                            if (errors.length > 0 || !Mnemonic.verify(this.state.mnemonic.join())) {
                                // display an error somewhere
                                return;
                            }

                            props.createHDWallet(this.state.mnemonic.join(' '), () =>
                                props.navigation.navigate(
                                    'MainNavigation',
                                    {},
                                    NavigationActions.navigate({ routeName: 'Dashboard' })
                                )
                            );
                        }}
                    >
                        {translate('App.labels.confirm')}
                    </Button>
                </View>
            </View>
        );
    }

    // returns an array of words starting with `text` from dictionary
    private getSuggestions(text: string) {
        return text && text.length > 1 ? wordlists.EN.filter(w => w.startsWith(text)) : [];
    }

    // fills text when user selects a suggestion / pastes
    private fillMnemonicText(text) {
        const mnemonic = this.state.mnemonic.slice();
        const index = this.state.indexForSuggestions;

        mnemonic[index] = text;

        this.setState({
            mnemonic
        });

        // if we are not on last word, jump to next input
        if (index < 23) {
            this.focusInput(index + 1);
        } else {
            this.focusInput(index);
        }
    }

    private async pasteFromClipboard() {
        let clipboardText = await Clipboard.getString();
        if (clipboardText) {
            clipboardText = this.state.mnemonic[this.state.indexForSuggestions] + clipboardText;
            this.fillMnemonicText(clipboardText);
        }
    }

    private focusInput(index) {
        if (index > -1 && index < 24 && this.inputView[index]) {
            this.inputView[index].focus();

            this.setState({
                suggestions: this.getSuggestions(this.state.mnemonic[index]),
                indexForSuggestions: index
            });
        }
    }

    private getInputLine(lineNumber: number) {
        const output = [];

        for (let i = 0; i < 4; i++) {
            const n = lineNumber * 4 + i;
            const error = this.state.errors.indexOf(n) !== -1;
            output.push(
                <View style={this.props.styles.inputContainer} key={n}>
                    <Text small style={this.props.styles.inputLabel}>{`${n + 1}.`}</Text>
                    <TextInput
                        testID={`input-${n}`}
                        style={[
                            this.props.styles.input,
                            error && { borderBottomColor: this.props.theme.colors.negative }
                        ]}
                        placeholderTextColor={this.props.theme.colors.textSecondary}
                        placeholder=""
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={this.props.theme.colors.accent}
                        onChangeText={(text: string) => {
                            this.setMnemonicText(n, text);
                        }}
                        onFocus={() => {
                            this.focusInput(n);
                        }}
                        value={this.state.mnemonic[n]}
                        ref={input => {
                            this.inputView[n] = input;
                        }}
                    />
                </View>
            );
        }
        return output;
    }

    // generate text input matrix for mnemonic
    private getInputMatrix() {
        const output = [];

        for (let i = 0; i < 6; i++) {
            output.push(
                <View style={this.props.styles.mnemonicLine} key={i}>
                    {this.getInputLine(i)}
                </View>
            );
        }

        return output;
    }
}

export const RecoverWalletScreen = smartConnect(RecoverWalletScreenComponent, [
    connect(
        (state: IReduxState) => ({
            tosVersion: state.app.tosVersion
        }),
        {
            createHDWallet
        }
    ),
    withTheme(stylesProvider)
]);
