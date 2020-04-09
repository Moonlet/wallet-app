import React from 'react';
import { View, ScrollView, Clipboard } from 'react-native';
import { Text, TabSelect } from '../../library';
import { Button } from '../../library/button/button';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { wordlists } from 'bip39';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { createHDWallet } from '../../redux/wallets/actions';
import { Mnemonic } from '../../core/wallet/hd-wallet/mnemonic';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { KeyboardCustom, IKeyboardButton } from '../../components/keyboard-custom/keyboard-custom';
import { TextInput } from '../../components/text-input/text-input';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { StackActions, NavigationActions } from 'react-navigation';
import { openLoadingModal } from '../../redux/ui/loading-modal/actions';
import { forbidScreenshots, allowScreenshots } from '../../core/utils/screenshot';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';
import { MNEMONIC_LENGTH } from '../../core/constants/app';
import { DialogComponent } from '../../components/dialog/dialog-component';

interface IState {
    mnemonic: string[];
    suggestions: string[];
    indexForSuggestions: number;
    errors: number[];
    validInputs: number[];
    numberMnemonics: number;
    unveilMnemonic: boolean;
}

export interface IReduxProps {
    createHDWallet: typeof createHDWallet;
    openLoadingModal: typeof openLoadingModal;
}

const mapDispatchToProps = {
    createHDWallet,
    openLoadingModal
};

export const navigationOptions = () => ({
    title: translate('App.labels.recover')
});

export class RecoverWalletScreenComponent extends React.Component<
    IReduxProps & INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
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
            mnemonic: new Array(MNEMONIC_LENGTH).fill(''),
            // mnemonic24: 'panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon'.split(' '),
            // mnemonic12: 'author tumble model pretty exile little shoulder frost bridge mistake devote mixed'.split(' '),
            suggestions: [],
            errors: [],
            indexForSuggestions: -1,
            validInputs: [],
            numberMnemonics: MNEMONIC_LENGTH,
            unveilMnemonic: false
        };

        forbidScreenshots();
    }

    public componentWillUnmount() {
        allowScreenshots();
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

    public mnemonicsFilled = () => this.state.mnemonic.indexOf('') === -1;

    private createWallet(password: string) {
        this.props.createHDWallet(this.state.mnemonic.join(' '), password, () => {
            this.props.navigation.dispatch(StackActions.popToTop());
            this.props.navigation.navigate(
                'MainNavigation',
                {},
                NavigationActions.navigate({ routeName: 'Dashboard' })
            );
        });
    }

    public async confirm() {
        if (!this.validateMnemonicWords() || !Mnemonic.verify(this.state.mnemonic.join(' '))) {
            // TODO: display an error somewhere
            DialogComponent.info(
                translate('App.labels.warning'),
                translate('App.labels.mnemonicNotValid')
            );
            return;
        }

        try {
            const currentPassword = await PasswordModal.getPassword(undefined, undefined, {
                shouldCreatePassword: true
            });
            this.createWallet(currentPassword);
        } catch (err) {
            try {
                const newPassword = await PasswordModal.createPassword();
                this.createWallet(newPassword);
            } catch (err) {
                //
            }
        }
    }

    public render() {
        const { styles } = this.props;

        const keyboardButtons: IKeyboardButton[] = [
            {
                label: translate('App.labels.holdUnveil'),
                onPress: () => {
                    //
                },
                onPressIn: () => this.setState({ unveilMnemonic: true }),
                onPressOut: () => this.setState({ unveilMnemonic: false })
            },
            {
                label: translate('App.labels.nextWord'),
                onPress: () => this.focusInput(this.state.indexForSuggestions + 1),
                disabled: this.mnemonicsFilled()
            },
            {
                label: translate('App.labels.confirm'),
                onPress: () => this.confirm(),
                style: { color: this.props.theme.colors.accent },
                disabled: !this.mnemonicsFilled()
            }
        ];

        return (
            <View style={styles.container}>
                <TabSelect
                    options={{
                        24: { title: '24' },
                        12: { title: '12' }
                    }}
                    onSelectionChange={key =>
                        this.setState({
                            numberMnemonics: parseInt(key, 10),
                            mnemonic: new Array(parseInt(key, 10)).fill(''),
                            suggestions: [],
                            errors: [],
                            indexForSuggestions: -1,
                            validInputs: []
                        })
                    }
                    selected={String(this.state.numberMnemonics)}
                    smallTab
                />

                <View style={styles.mnemonicContainer}>{this.getInputMatrix()}</View>

                <View>
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
                </View>

                {isFeatureActive(RemoteFeature.DEV_TOOLS) && (
                    <Button onPress={() => this.pasteFromClipboard()} style={styles.pasteButton}>
                        {translate('App.labels.paste')}
                    </Button>
                )}

                <KeyboardCustom
                    handleTextUpdate={(text: string) => this.setMnemonicText(text)}
                    handleDeleteKey={() => this.deleteMnemonicText()}
                    buttons={keyboardButtons}
                    disableSpace
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
            if (index < this.state.numberMnemonics - 1) {
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
                const mnemonic = new Array(this.state.numberMnemonics)
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
            const validInputs = this.state.validInputs.slice();
            validInputs.push(index);
            this.setState({ validInputs });

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
            previousIndex < this.state.numberMnemonics &&
            this.inputView[previousIndex]
        ) {
            this.inputView[this.state.indexForSuggestions].blur();
        }

        // Focus current word
        if (index > -1 && index < this.state.numberMnemonics && this.inputView[index]) {
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
            const isValid = this.state.validInputs.indexOf(index) !== -1;
            const isFocus = this.state.indexForSuggestions === index;

            let labelColor = this.props.theme.colors.text;
            if (isFocus) {
                labelColor = this.props.theme.colors.accent;
            } else if (isValid) {
                labelColor = this.props.theme.colors.text;
            } else if (error) {
                labelColor = this.props.theme.colors.error;
            }

            let word = this.state.mnemonic[index];
            if (word !== '' && isValid && !this.state.unveilMnemonic && !isFocus) {
                word = '**********';
            }

            output.push(
                <View style={this.props.styles.inputContainer} key={index}>
                    <Text style={[this.props.styles.inputLabel, { color: labelColor }]}>
                        {`${index + 1}.`}
                    </Text>
                    <TextInput
                        obRef={(input: any) => (this.inputView[index] = input)}
                        style={[
                            error && { borderBottomColor: this.props.theme.colors.error },
                            this.props.styles.inputLabel,
                            { flex: 1 }
                        ]}
                        word={word}
                        onFocus={() => this.focusInput(index)}
                        onBlur={() => this.validateWord()}
                        isFocus={isFocus}
                        isValid={isValid}
                        showBorderBottom={true}
                    />
                </View>
            );
        }
        return output;
    }

    // generate text input matrix for mnemonic
    private getInputMatrix() {
        const output = [];
        const numberOfLines = this.state.numberMnemonics / 4;

        for (let i = 0; i < numberOfLines; i++) {
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
    connect(null, mapDispatchToProps),
    withTheme(stylesProvider)
]);
