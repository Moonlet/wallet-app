import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Mnemonic } from '../../core/wallet/hd-wallet/mnemonic';
import { translate } from '../../core/i18n';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

interface IState {
    mnemonic: string[];
}

export class CreateWalletMnemonicScreenComponent extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            mnemonic: new Array(24).fill('')
        };
    }

    async componentDidMount() {
        const mnemonic = await Mnemonic.generate();
        this.setState({
            mnemonic: mnemonic.split(' ')
        });
    }

    public render() {
        const props = this.props;
        return (
            <View style={props.styles.container}>
                <View style={props.styles.topContainer}>
                    <View style={props.styles.mnemonicContainer}>
                        {this.state.mnemonic.reduce((out: any, word: string, i: number) => {
                            if (i % 4 === 0) {
                                const line = this.state.mnemonic.slice(i, i + 4);
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
                        {translate('CreateWalletMnemonic.body')}
                    </Text>
                </View>
                <View style={props.styles.bottomContainer}>
                    <Button
                        testID="button-next"
                        style={props.styles.bottomButton}
                        primary
                        onPress={() => {
                            props.navigation.navigate('CreateWalletConfirmMnemonic');
                        }}
                    >
                        {translate('App.labels.next')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const navigationOptions = ({ navigation }: any) => ({
    title: 'Create'
});

export const CreateWalletMnemonicScreen = withTheme(stylesProvider)(
    CreateWalletMnemonicScreenComponent
);

CreateWalletMnemonicScreen.navigationOptions = navigationOptions;
