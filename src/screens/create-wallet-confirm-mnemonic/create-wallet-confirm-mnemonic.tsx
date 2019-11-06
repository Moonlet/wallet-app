import React, { useState } from 'react';
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
import { withTheme } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { createHDWallet } from '../../redux/wallets/actions';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    createHDWallet: (mnemonic: string, callback: () => any) => void;
}

/**
 * draws a textinput for a random mnemonic word
 * @param n {number}
 * @param callback {function}
 * @param styles
 * @param theme
 */
const getWordInput = (
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

export const CreateWalletConfirmMnemonicScreenComponent = (props: IProps & IReduxProps) => {
    // TODO: no mnemonic? where to?
    const mnemonic =
        props.navigation.state &&
        props.navigation.state.params &&
        props.navigation.state.params.mnemonic;

    // holds index of three random words from mnemonic
    const [testWords, setTestWords] = useState([]);

    // holds user input
    const [mnemonicsInput, setWords] = useState({} as any);

    const [error, setError] = useState(false);

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

    // check if every input has some content typed in
    const allInputsFilled = testWords.every(
        (n: number) => mnemonicsInput[n] && mnemonicsInput[n].length > 0
    );

    return (
        <View style={props.styles.container}>
            <View style={props.styles.topContainer}>
                <Text darker style={{ textAlign: 'center' }}>
                    {translate('CreateWalletMnemonicConfirm.body')}
                </Text>
                <View style={props.styles.inputContainer}>
                    {error && (
                        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                            {translate('CreateWalletMnemonicConfirm.errors.tryAgain')}
                        </Text>
                    )}
                    {testWords.map((n, i) =>
                        getWordInput(
                            n,
                            (text: string) => {
                                setWords({ ...mnemonicsInput, ...{ [n]: text } });
                            },
                            props.styles,
                            props.theme
                        )
                    )}
                </View>
                <Text darker small>
                    {testWords.map((n, i) => mnemonic[n] + ' ')}
                </Text>
            </View>
            <View style={props.styles.bottomContainer}>
                <Button
                    testID="button-confirm"
                    style={props.styles.bottomButton}
                    primary
                    disabled={!allInputsFilled}
                    onPress={() => {
                        const valid = testWords.every(
                            (n: number) => mnemonicsInput[n] === mnemonic[n]
                        );
                        if (!valid) {
                            setError(true);
                            return;
                        }
                        props.createHDWallet(mnemonic.join(' '), () => {
                            props.navigation.navigate(
                                'MainNavigation',
                                {},
                                NavigationActions.navigate({ routeName: 'Dashboard' })
                            );
                        });
                    }}
                >
                    {translate('App.labels.confirm')}
                </Button>
            </View>
        </View>
    );
};

export const navigationOptions = ({ navigation }: any) => ({
    title: 'Create'
});

export const CreateWalletConfirmMnemonicScreen = smartConnect(
    CreateWalletConfirmMnemonicScreenComponent,
    [
        connect(
            null,
            {
                createHDWallet
            }
        ),
        withTheme(stylesProvider)
    ]
);

CreateWalletConfirmMnemonicScreenComponent.navigationOptions = navigationOptions;
