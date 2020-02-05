import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    NavigationActions
} from 'react-navigation';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { createHDWallet } from '../../redux/wallets/actions';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { KeyboardCustom } from '../../components/keyboard-custom/keyboard-custom';
import { TextInput } from '../../components/text-input/text-input';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    createHDWallet: (mnemonic: string, password: string, callback: () => any) => void;
}

const navigationOptions = () => ({
    title: translate('App.labels.create')
});

export interface IState {
    mnemonic: string[];

    // holds index of three random words from mnemonic
    testWords: number[];

    // holds user input
    mnemonicsInput: {};

    error: boolean;
    indexInputFocus: number;
}

export class CreateWalletConfirmMnemonicScreenComponent extends React.Component<
    IReduxProps & INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal = null;
    public inputView: any = [];

    constructor(
        props: IReduxProps &
            INavigationProps &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            // TODO: no mnemonic? where to?
            mnemonic: props.navigation.state?.params?.mnemonic,
            testWords: [],
            mnemonicsInput: {},
            error: false,
            indexInputFocus: -1
        };
    }

    public componentDidMount() {
        // generate three unique random test numbers
        if (this.state.testWords.length < 3) {
            const randomNumbers: any = [];
            while (randomNumbers.length < 3) {
                const n = Math.floor(Math.random() * 24);
                if (!randomNumbers.includes(n)) {
                    randomNumbers.push(n);
                }
            }

            this.setState({ testWords: randomNumbers });
        }
    }

    // check if every input has some content typed in
    public allInputsFilled = () =>
        this.state.testWords.every(
            (n: number) => this.state.mnemonicsInput[n] && this.state.mnemonicsInput[n].length > 0
        );

    /**
     * draws a TextInput for a random mnemonic word
     * @param index {number}
     * @param styles
     */
    public getWordInput = (index: number, styles: ReturnType<typeof stylesProvider>) => {
        return (
            <TextInput
                key={`word-${index}`}
                obRef={(input: any) => (this.inputView[index] = input)}
                style={styles.inputWrapper}
                styleInputText={styles.inputText}
                word={this.state.mnemonicsInput[index] ? this.state.mnemonicsInput[index] : ''}
                onFocus={() => this.focusInput(index)}
                isFocus={this.state.indexInputFocus === index}
                placeholder={`Word #${index + 1}`}
                showBorderBottomColor={false}
            />
        );
    };

    public setMnemonicText(text: string) {
        const mnemonicsInput = this.state.mnemonicsInput;

        const index = this.state.indexInputFocus;
        if (mnemonicsInput[index]) {
            mnemonicsInput[index] += text;
        } else {
            mnemonicsInput[index] = text;
        }

        this.setState({ mnemonicsInput });
    }

    public deleteMnemonicText() {
        const mnemonicsInput = this.state.mnemonicsInput;

        const index = this.state.indexInputFocus;
        mnemonicsInput[index] = mnemonicsInput[index].slice(0, -1);

        this.setState({ mnemonicsInput });
    }

    public confirm = () => {
        const valid = this.state.testWords.every(
            (n: number) => this.state.mnemonicsInput[n] === this.state.mnemonic[n]
        );
        if (valid) {
            this.passwordModal.requestPassword().then(password => {
                this.props.createHDWallet(this.state.mnemonic.join(' '), password, () =>
                    this.props.navigation.navigate(
                        'MainNavigation',
                        {},
                        NavigationActions.navigate({
                            routeName: 'Dashboard'
                        })
                    )
                );
            });
        } else {
            this.setState({ error: true });
        }
    };

    public focusInput(index: number) {
        // Blur previous word
        const previousIndex = this.state.indexInputFocus;

        if (previousIndex > -1 && this.inputView[previousIndex]) {
            this.inputView[this.state.indexInputFocus].blur();
        }

        // Focus current word
        if (index > -1 && this.inputView[index]) {
            this.inputView[index].focus();
        }

        this.setState({ indexInputFocus: index });
    }

    public render() {
        return (
            <View style={this.props.styles.container}>
                <Text darker style={{ textAlign: 'center' }}>
                    {translate('CreateWalletMnemonicConfirm.body')}
                </Text>

                <View style={this.props.styles.inputContainer}>
                    {this.state.testWords.map(n => this.getWordInput(n, this.props.styles))}
                    {this.state.error && (
                        <Text style={this.props.styles.errorMessage}>
                            {translate('CreateWalletMnemonicConfirm.errors.tryAgain')}
                        </Text>
                    )}
                </View>

                <Text darker small>
                    {this.state.testWords.map(n => this.state.mnemonic[n] + ' ')}
                </Text>

                <KeyboardCustom
                    handleTextUpdate={(text: string) => this.setMnemonicText(text)}
                    handleDeleteKey={() => this.deleteMnemonicText()}
                    buttons={[
                        {
                            label: translate('App.labels.nextWord'),
                            onPress: () => {
                                this.focusInput(
                                    this.state.testWords[
                                        this.state.testWords.indexOf(this.state.indexInputFocus) + 1
                                    ]
                                );
                            }
                        },
                        {
                            label: translate('App.labels.confirm'),
                            onPress: () => this.confirm(),
                            style: { color: this.props.theme.colors.accent },
                            disabled: !this.allInputsFilled()
                        }
                    ]}
                    disableSpace
                />

                <PasswordModal
                    shouldCreatePassword={true}
                    subtitle={translate('Password.subtitleMnemonic')}
                    obRef={ref => (this.passwordModal = ref)}
                />
            </View>
        );
    }
}

export const CreateWalletConfirmMnemonicScreen = smartConnect(
    CreateWalletConfirmMnemonicScreenComponent,
    [
        connect(null, {
            createHDWallet
        }),
        withTheme(stylesProvider)
    ]
);
