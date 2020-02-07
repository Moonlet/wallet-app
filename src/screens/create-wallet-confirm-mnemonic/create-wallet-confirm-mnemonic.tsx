import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { NavigationActions } from 'react-navigation';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { createHDWallet } from '../../redux/wallets/actions';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { KeyboardCustom } from '../../components/keyboard-custom/keyboard-custom';
import { TextInput } from '../../components/text-input/text-input';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';

export interface IReduxProps {
    createHDWallet: (mnemonic: string, password: string, callback: () => any) => void;
}

const navigationOptions = () => ({
    title: translate('App.labels.create')
});

interface IMnemonicsInput {
    [index: number]: string;
}

// check if every input has some content typed in
const allInputsFilled = (testWords: number[], mnemonicsInput: IMnemonicsInput) =>
    testWords.every((n: number) => mnemonicsInput[n] && mnemonicsInput[n].length > 0);

const focusInput = (currentIndex: number, inputView: any, stateIndexInputFocus?: number) => {
    if (stateIndexInputFocus) {
        // Blur previous word
        const previousIndex = stateIndexInputFocus;

        if (previousIndex > -1 && inputView[previousIndex]) {
            inputView[previousIndex].blur();
        }
    }

    // Focus current word
    if (currentIndex > -1 && inputView[currentIndex]) {
        inputView[currentIndex].focus();
    }
};

export const CreateWalletConfirmMnemonicScreenComponent = (
    props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    // TODO: no mnemonic? where to?
    const mnemonic = props.navigation.state?.params?.mnemonic;

    // holds index of three random words from mnemonic
    const [testWords, setTestWords] = useState<number[]>([]);

    // holds user input
    const [mnemonicsInput, setMnemonicsInput] = useState<IMnemonicsInput>({} as any);

    const [error, setError] = useState<boolean>(false);

    const [indexInputFocus, setIndexInputFocus] = useState<number>(-1);

    const [inputView, setInputView] = useState<any>([]);

    // generate three unique random test numbers
    if (testWords.length < 3) {
        const randomNumbers: any = [];
        while (randomNumbers.length < 3) {
            const n = Math.floor(Math.random() * 24);
            if (!randomNumbers.includes(n)) {
                randomNumbers.push(n);
            }
        }

        setTestWords(randomNumbers);
    }

    return (
        <View style={props.styles.container}>
            <Text darker style={{ textAlign: 'center' }}>
                {translate('CreateWalletMnemonicConfirm.body')}
            </Text>

            <View style={props.styles.inputContainer}>
                {testWords.map((index: number) => (
                    <TextInput
                        key={`word-${index}`}
                        obRef={(input: any) => {
                            inputView[index] = input;
                            setInputView(inputView);
                        }}
                        style={props.styles.inputWrapper}
                        styleInputText={props.styles.inputText}
                        word={mnemonicsInput[index] ? mnemonicsInput[index] : ''}
                        onFocus={() => {
                            focusInput(index, inputView);
                            setIndexInputFocus(index);
                        }}
                        isFocus={indexInputFocus === index}
                        placeholder={`Word #${index + 1}`}
                        showBorderBottomColor={false}
                    />
                ))}
                {error && (
                    <Text style={props.styles.errorMessage}>
                        {translate('CreateWalletMnemonicConfirm.errors.tryAgain')}
                    </Text>
                )}
            </View>

            {isFeatureActive(RemoteFeature.DEV) && (
                <Text darker small>
                    {testWords.map(n => mnemonic[n] + ' ')}
                </Text>
            )}

            <KeyboardCustom
                handleTextUpdate={(text: string) => {
                    let input = mnemonicsInput[indexInputFocus];
                    if (input) {
                        input += text;
                    } else {
                        input = text;
                    }
                    setMnemonicsInput({ ...mnemonicsInput, ...{ [indexInputFocus]: input } });
                }}
                handleDeleteKey={() => {
                    let input = mnemonicsInput[indexInputFocus];
                    if (input) {
                        input = input.slice(0, -1);
                    }
                    setMnemonicsInput({ ...mnemonicsInput, ...{ [indexInputFocus]: input } });
                }}
                buttons={[
                    {
                        label: translate('App.labels.nextWord'),
                        onPress: () => {
                            const nextIndexFocus =
                                testWords[testWords.indexOf(indexInputFocus) + 1];
                            focusInput(nextIndexFocus, inputView, indexInputFocus);
                            setIndexInputFocus(nextIndexFocus);
                        }
                    },
                    {
                        label: translate('App.labels.confirm'),
                        onPress: () => {
                            const valid = testWords.every(
                                (n: number) => mnemonicsInput[n] === mnemonic[n]
                            );
                            if (valid) {
                                this.passwordModal.requestPassword().then(password => {
                                    props.createHDWallet(mnemonic.join(' '), password, () =>
                                        props.navigation.navigate(
                                            'MainNavigation',
                                            {},
                                            NavigationActions.navigate({
                                                routeName: 'Dashboard'
                                            })
                                        )
                                    );
                                });
                            } else {
                                setError(true);
                            }
                        },
                        style: { color: props.theme.colors.accent },
                        disabled: !allInputsFilled(testWords, mnemonicsInput)
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
};

CreateWalletConfirmMnemonicScreenComponent.navigationOptions = navigationOptions;

export const CreateWalletConfirmMnemonicScreen = smartConnect(
    CreateWalletConfirmMnemonicScreenComponent,
    [
        connect(null, {
            createHDWallet
        }),
        withTheme(stylesProvider)
    ]
);
