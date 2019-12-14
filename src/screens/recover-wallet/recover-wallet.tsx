import React from 'react';
import { View, ScrollView, Clipboard } from 'react-native';
import { Text } from '../../library';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { wordlists } from 'bip39';
import { translate } from '../../core/i18n';
import { HeaderLeft } from '../../components/header-left/header-left';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { TOS_VERSION } from '../../core/constants/app';
import { createHDWallet } from '../../redux/wallets/actions';
import { Mnemonic } from '../../core/wallet/hd-wallet/mnemonic';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { KeyboardCustom } from '../../components/keyboard-custom/keyboard-custom';
import { TextInput } from '../../components/text-input/text-input';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { NavigationActions } from 'react-navigation';

const NUMBER_MNEMONICS = 24;

interface IState {
    mnemonic: string[];
    suggestions: string[];
    indexForSuggestions: number;
    errors: number[];
}

export interface IReduxProps {
    tosVersion: number;
    createHDWallet: (mnemonic: string, password: string, callback: () => any) => void;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () =>
        navigation.state?.params?.goBack && (
            <HeaderLeft
                icon="arrow-left-1"
                text="Back"
                onPress={() => {
                    navigation.state.params.goBack(navigation);
                }}
            />
        ),
    title: translate('App.labels.recover')
});

export class RecoverWalletScreenComponent extends React.Component<
    IReduxProps & INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal = null;
    public suggestionsScrollView: any;
    public inputView: any = [];

    constructor(
        props: IReduxProps &
            INavigationProps &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            mnemonic: new Array(NUMBER_MNEMONICS).fill(''),
            // mnemonic: 'panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon'.split(' '),
            suggestions: [],
            errors: [],
            indexForSuggestions: -1
        };

        if (!props.tosVersion || TOS_VERSION > props.tosVersion) {
            props.navigation.navigate('CreateWalletTerms');
        }
    }

    public setMnemonicText(text: string) {
        const mnemonic = this.state.mnemonic.slice();

        const index = this.state.indexForSuggestions;
        mnemonic[index] += text;

        this.setState({
            mnemonic,
            suggestions: this.getSuggestions(mnemonic[index]),
            indexForSuggestions: index
        });
    }

    public deleteMnemonicText() {
        const mnemonic = this.state.mnemonic.slice();

        const index = this.state.indexForSuggestions;
        mnemonic[index] = mnemonic[index].slice(0, -1);

        this.setState({
            mnemonic,
            suggestions: this.getSuggestions(mnemonic[index]),
            indexForSuggestions: index
        });
    }

    public confirm() {
        if (!this.validateMnemonicWords() || !Mnemonic.verify(this.state.mnemonic.join(' '))) {
            // display an error somewhere
            return;
        }

        this.passwordModal.requestPassword().then(password => {
            this.props.createHDWallet(this.state.mnemonic.join(' '), password, () =>
                this.props.navigation.navigate(
                    'MainNavigation',
                    {},
                    NavigationActions.navigate({ routeName: 'Dashboard' })
                )
            );
        });
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.mnemonicContainer}>{this.getInputMatrix()}</View>

                <ScrollView
                    ref={ref => (this.suggestionsScrollView = ref)}
                    horizontal
                    overScrollMode={'never'}
                    snapToAlignment={'start'}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.suggestionsContainer}
                    keyboardShouldPersistTaps={'handled'}
                >
                    {this.state.suggestions.map((word, i) => (
                        <View key={i}>
                            <Button
                                testID={`button-suggestion-${i}`}
                                secondary
                                style={styles.suggestionButton}
                                onPress={() => this.fillMnemonicText(word)}
                            >
                                {word}
                            </Button>
                        </View>
                    ))}
                </ScrollView>

                <KeyboardCustom
                    handleTextUpdate={(text: string) => this.setMnemonicText(text)}
                    handleDeleteKey={() => this.deleteMnemonicText()}
                    buttons={[
                        {
                            label: translate('App.labels.paste'),
                            onPress: () => this.pasteFromClipboard()
                        },
                        {
                            label: translate('App.labels.confirm'),
                            onPress: () => this.confirm(),
                            style: { color: this.props.theme.colors.accent }
                        }
                    ]}
                    footerButton={{
                        label: translate('App.labels.nextWord'),
                        onPress: () => this.focusInput(this.state.indexForSuggestions + 1)
                    }}
                />

                <PasswordModal
                    subtitle={translate('Password.subtitleMnemonic')}
                    obRef={ref => (this.passwordModal = ref)}
                />
            </View>
        );
    }

    // returns an array of words starting with `text` from dictionary
    private getSuggestions(text: string) {
        return text && text.length > 1 ? wordlists.EN.filter(w => w.startsWith(text)) : [];
    }

    // fills text when user selects a suggestion / pastes
    private fillMnemonicText(text: string) {
        const mnemonic = this.state.mnemonic.slice();
        const index = this.state.indexForSuggestions;

        mnemonic[index] = text;
        this.setState({ mnemonic }, () => {
            this.validateWord();

            // if we are not on last word, jump to next input
            if (index < NUMBER_MNEMONICS - 1) {
                this.focusInput(index + 1);
            } else {
                this.setState({ suggestions: [] });
                this.inputView[this.state.indexForSuggestions].blur();
            }
        });
    }

    private async pasteFromClipboard() {
        let clipboardText = await Clipboard.getString();
        if (clipboardText) {
            if (clipboardText.indexOf(' ') !== -1) {
                // multiple words, replace mnemonic in state
                const clipboardMnemonicWords = clipboardText.split(' ');
                const mnemonic = new Array(NUMBER_MNEMONICS)
                    .fill('')
                    .map((w, i) => (clipboardMnemonicWords[i] ? clipboardMnemonicWords[i] : ''));

                this.setState({ mnemonic });
                this.validateMnemonicWords();
            } else {
                // paste single word
                clipboardText = this.state.mnemonic[this.state.indexForSuggestions] + clipboardText;
                this.fillMnemonicText(clipboardText);
            }
        }
    }

    // validates entire mnemonic, returns false if invalid words found
    private validateMnemonicWords() {
        const errors = [];
        this.state.mnemonic.forEach((word: string, index: number) => {
            if (word === '' || wordlists.EN.indexOf(word) === -1) {
                errors.push(index);
            }
        });

        this.setState({ errors });

        return errors.length === 0;
    }

    // validates single word
    private validateWord() {
        const index = this.state.indexForSuggestions;

        if (wordlists.EN.indexOf(this.state.mnemonic[index]) === -1) {
            if (this.state.errors.indexOf(index) === -1) {
                const errors = this.state.errors.slice();
                errors.push(index);

                this.setState({ errors });
            }
        } else {
            const indexPos = this.state.errors.indexOf(index);
            if (indexPos !== -1) {
                const errors = this.state.errors.slice();
                errors.splice(indexPos, 1);

                this.setState({ errors });
            }
        }
    }

    private focusInput(index: number) {
        // Blur previous word
        const previousIndex = this.state.indexForSuggestions;
        if (
            previousIndex > -1 &&
            previousIndex < NUMBER_MNEMONICS &&
            this.inputView[previousIndex]
        ) {
            this.inputView[this.state.indexForSuggestions].blur();
        }

        // Focus current word
        if (index > -1 && index < NUMBER_MNEMONICS && this.inputView[index]) {
            this.inputView[index].focus();
        }

        this.setState({
            suggestions: this.getSuggestions(this.state.mnemonic[index]),
            indexForSuggestions: index
        });
    }

    private getInputLine(lineNumber: number) {
        const output = [];

        for (let i = 0; i < 4; i++) {
            const index = lineNumber * 4 + i;
            const error = this.state.errors.indexOf(index) !== -1;
            output.push(
                <View style={this.props.styles.inputContainer} key={index}>
                    <Text small style={this.props.styles.inputLabel}>{`${index + 1}.`}</Text>
                    <TextInput
                        obRef={(input: any) => (this.inputView[index] = input)}
                        style={[error && { borderBottomColor: this.props.theme.colors.error }]}
                        word={this.state.mnemonic[index]}
                        onFocus={() => this.focusInput(index)}
                        onBlur={() => this.validateWord()}
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
    connect((state: IReduxState) => ({ tosVersion: state.app.tosVersion }), { createHDWallet }),
    withTheme(stylesProvider)
]);
