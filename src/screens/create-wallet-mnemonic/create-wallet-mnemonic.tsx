import React from 'react';
import { View } from 'react-native';
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
import { Mnemonic } from '../../core/wallet/hd-wallet/mnemonic';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export const CreateWalletMnemonicScreenComponent = (props: IProps) => {
    const mnemonic: string[] = Mnemonic.generate().split(' ');

    // const mnemonic = [
    //     'pyramid',
    //     'wonder',
    //     'swing',
    //     'file',
    //     'promote',
    //     'end',
    //     'crush',
    //     'enemy',
    //     'abandon',
    //     'abstract',
    //     'eye',
    //     'frozen',
    //     'scissors',
    //     'radar',
    //     'dolphin',
    //     'primary',
    //     'stumble',
    //     'suit',
    //     'naive',
    //     'color',
    //     'abstract',
    //     'crowd',
    //     'tiger',
    //     'boil'
    // ];

    return (
        <View style={props.styles.container}>
            <View style={props.styles.topContainer}>
                <View style={props.styles.mnemonicContainer}>
                    {mnemonic.reduce((out: any, word: string, i: number) => {
                        if (i % 4 === 0) {
                            const line = mnemonic.slice(i, i + 4);
                            out = [
                                ...out,
                                <View style={props.styles.mnemonicLine} key={i}>
                                    {line.map((w, k) => (
                                        <Text small key={k} style={props.styles.mnemonicWord}>
                                            {i + k + 1}. {w}
                                        </Text>
                                    ))}
                                </View>
                            ];
                        }
                        return out;
                    }, [])}
                </View>
                <Text darker style={{ marginTop: 20 }}>
                    Please save the recovery phrase and keep it in a safe place. The recovery phrase
                    is the only way to restore your Moonlet wallet in case you lose your phone or
                    forget your password.
                </Text>
            </View>
            <View style={props.styles.bottomContainer}>
                <Button
                    testID="button-next"
                    style={props.styles.bottomButton}
                    primary
                    onPress={() => {
                        props.navigation.navigate(
                            'MainNavigation',
                            {},
                            NavigationActions.navigate({ routeName: 'Dashboard' })
                        );
                    }}
                >
                    Next
                </Button>
            </View>
        </View>
    );
};

export const navigationOptions = ({ navigation }: any) => ({
    title: 'Create'
});

export const CreateWalletMnemonicScreen = withTheme(stylesProvider)(
    CreateWalletMnemonicScreenComponent
);

CreateWalletMnemonicScreen.navigationOptions = navigationOptions;
