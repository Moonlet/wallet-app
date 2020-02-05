import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '../../library';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    NavigationActions
} from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { createHDWallet } from '../../redux/wallets/actions';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { INavigationProps } from '../../navigation/with-navigation-params';

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
    testWords: [];

    // holds user input
    mnemonicsInput: {};

    error: boolean;
}

export class CreateWalletConfirmMnemonicScreenComponent extends React.Component<
    IReduxProps & INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal = null;

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
            error: false
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
     * draws a textinput for a random mnemonic word
     * @param n {number}
     * @param callback {function}
     * @param styles
     * @param theme
     */
    public getWordInput = (
        n: number,
        callback: any,
        styles: ReturnType<typeof stylesProvider>,
        theme: ITheme
    ) => (
        <TextInput
            style={styles.input}
            placeholderTextColor={theme.colors.textSecondary}
            placeholder={`Word #${n + 1}`}
            autoCapitalize={'none'}
            autoCorrect={false}
            selectionColor={theme.colors.accent}
            key={n}
            onChangeText={callback}
            testID={`input-password-${n}`}
        />
    );

    public render() {
        return (
            <View style={this.props.styles.container}>
                <View style={this.props.styles.topContainer}>
                    <Text darker style={{ textAlign: 'center' }}>
                        {translate('CreateWalletMnemonicConfirm.body')}
                    </Text>

                    <View style={this.props.styles.inputContainer}>
                        {this.state.error && (
                            <Text style={this.props.styles.errorMessage}>
                                {translate('CreateWalletMnemonicConfirm.errors.tryAgain')}
                            </Text>
                        )}
                        {this.state.testWords.map((n, i) =>
                            this.getWordInput(
                                n,
                                (text: string) => {
                                    this.setState({
                                        mnemonicsInput: {
                                            ...this.state.mnemonicsInput,
                                            ...{ [n]: text }
                                        }
                                    });
                                },
                                this.props.styles,
                                this.props.theme
                            )
                        )}
                    </View>

                    <Text darker small>
                        {this.state.testWords.map((n, i) => this.state.mnemonic[n] + ' ')}
                    </Text>
                </View>

                <View style={this.props.styles.bottomContainer}>
                    <Button
                        testID="button-confirm"
                        style={this.props.styles.bottomButton}
                        primary
                        disabled={!this.allInputsFilled()}
                        onPress={() => {
                            const valid = this.state.testWords.every(
                                (n: number) =>
                                    this.state.mnemonicsInput[n] === this.state.mnemonic[n]
                            );
                            if (!valid) {
                                this.setState({ error: true });
                            } else {
                                this.passwordModal.requestPassword().then(password => {
                                    this.props.createHDWallet(
                                        this.state.mnemonic.join(' '),
                                        password,
                                        () =>
                                            this.props.navigation.navigate(
                                                'MainNavigation',
                                                {},
                                                NavigationActions.navigate({
                                                    routeName: 'Dashboard'
                                                })
                                            )
                                    );
                                });
                            }
                        }}
                    >
                        {translate('App.labels.confirm')}
                    </Button>
                </View>

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
