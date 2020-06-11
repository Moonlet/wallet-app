import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { StackActions, NavigationActions } from 'react-navigation';
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
import { MNEMONIC_LENGTH } from '../../core/constants/app';
import * as Sentry from '@sentry/react-native';

export interface IReduxProps {
    createHDWallet: typeof createHDWallet;
}

const navigationOptions = () => ({
    title: translate('App.labels.create')
});

interface IMnemonicsInput {
    [index: number]: string;
}

const mapDispatchToProps = {
    createHDWallet
};

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
            const n = Math.floor(Math.random() * MNEMONIC_LENGTH);
            if (!randomNumbers.includes(n)) {
                randomNumbers.push(n);
            }
        }

        setTestWords(randomNumbers);
    }

    const createWallet = (password: string) => {
        props.createHDWallet(mnemonic.join(' '), password, () => {
            props.navigation.dispatch(StackActions.popToTop());
            props.navigation.navigate(
                'MainNavigation',
                {},
                NavigationActions.navigate({ routeName: 'Dashboard' })
            );
        });
    };

    const confirm = async () => {
        try {
            const currentPassword = await PasswordModal.getPassword(undefined, undefined, {
                shouldCreatePassword: true
            });
            createWallet(currentPassword);
        } catch (err) {
            try {
                const newPassword = await PasswordModal.createPassword();
                createWallet(newPassword);
            } catch (err) {
                Sentry.captureException(new Error(JSON.stringify(err)));
                return Promise.reject(err);
            }
        }
    };

    return (
        <View testID="create-wallet-confirm-mnemonic" style={props.styles.container}>
            <Text darker style={{ textAlign: 'center' }}>
                {translate('CreateWalletMnemonicConfirm.body')}
            </Text>

            <View style={props.styles.inputContainer}>
                {testWords.map((index: number) => (
                    <View key={`word-${index}`}>
                        <Text style={props.styles.label}>
                            {mnemonicsInput[index] !== undefined || index === indexInputFocus
                                ? `Word #${index + 1}`
                                : ' '}
                        </Text>
                        <TextInput
                            testID={`textinput-${index}`}
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
                            showBorderBottom={false}
                        />
                    </View>
                ))}
                {error && (
                    <Text style={props.styles.errorMessage}>
                        {translate('CreateWalletMnemonicConfirm.errors.tryAgain')}
                    </Text>
                )}

                {isFeatureActive(RemoteFeature.DEV_TOOLS) && (
                    <View style={props.styles.testWords}>
                        {testWords.map((n, index) => (
                            <Text darker small key={index} testID={`mnemonic-${index}`}>
                                {mnemonic[n] + ' '}
                            </Text>
                        ))}
                    </View>
                )}
            </View>

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
                                confirm();
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
        </View>
    );
};

CreateWalletConfirmMnemonicScreenComponent.navigationOptions = navigationOptions;

export const CreateWalletConfirmMnemonicScreen = smartConnect(
    CreateWalletConfirmMnemonicScreenComponent,
    [connect(null, mapDispatchToProps), withTheme(stylesProvider)]
);
