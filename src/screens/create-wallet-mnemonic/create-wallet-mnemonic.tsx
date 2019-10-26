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

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: 'Wallet mnemonic'
});

export const CreateWalletMnemonicScreenComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <Text>Mnemonic</Text>
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
            Dashboard
        </Button>
    </View>
);

export const CreateWalletMnemonicScreen = withTheme(stylesProvider)(
    CreateWalletMnemonicScreenComponent
);

CreateWalletMnemonicScreen.navigationOptions = navigationOptions;
