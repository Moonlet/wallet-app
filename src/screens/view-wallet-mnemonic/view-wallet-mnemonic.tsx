import React from 'react';
import { View, Alert } from 'react-native';
import { Text } from '../../library';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { HeaderLeft } from '../../components/header-left/header-left';
import { smartConnect } from '../../core/utils/smart-connect';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { hash } from '../../core/secure/encrypt';
import { readEncrypted } from '../../core/secure/storage';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

interface IState {
    mnemonic: string[];
    showPasswordModal: boolean;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack(null);
                }}
            />
        );
    },
    title: 'View phrase'
});

export class ViewWalletMnemonicScreenComponent extends React.Component<IProps, IState> {
    public static navigationOptions = navigationOptions;

    constructor(props: any) {
        super(props);
        this.state = {
            mnemonic: new Array(24).fill(''),
            showPasswordModal: true
        };
    }

    public async onEnterPassword(password) {
        const walletId = this.props.navigation.state?.params?.wallet.id;

        if (!walletId) {
            // TODO show an error?
            this.props.navigation.goBack(null);
        }

        try {
            const passHash = await hash(password);
            const mnemonic = await readEncrypted(walletId, passHash);

            this.setState({
                showPasswordModal: false,
                mnemonic: mnemonic.split(' ')
            });
        } catch (e) {
            if (e.code === 'decrypt_fail') {
                Alert.alert(translate('App.labels.error'), translate('Wallets.invalidPassword'), [
                    { text: 'Ok' }
                ]);
            }
        }
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
                </View>
                <View style={props.styles.bottomContainer}>
                    <Button
                        style={props.styles.bottomButton}
                        primary
                        onPress={() => {
                            this.props.navigation.goBack(null);
                        }}
                    >
                        {translate('App.labels.close')}
                    </Button>
                </View>

                <PasswordModal
                    buttonLabel={translate('Wallets.unveil')}
                    infoText={translate('Wallets.unveilPasswordRequest')}
                    visible={this.state.showPasswordModal}
                    onReject={() => {
                        this.props.navigation.goBack(null);
                    }}
                    onConfirm={password => {
                        this.onEnterPassword(password);
                    }}
                />
            </View>
        );
    }
}

export const ViewWalletMnemonicScreen = smartConnect(ViewWalletMnemonicScreenComponent, [
    withTheme(stylesProvider)
]);
