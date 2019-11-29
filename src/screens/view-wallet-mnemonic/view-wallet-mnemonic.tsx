import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { smartConnect } from '../../core/utils/smart-connect';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { IWalletState } from '../../redux/wallets/state';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';

export interface INavigationParams {
    wallet: IWalletState;
}

interface IState {
    mnemonic: string[];
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('Wallets.viewPhrase')
});

export class ViewWalletMnemonicScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal: any;

    constructor(props: any) {
        super(props);
        this.state = {
            mnemonic: new Array(24).fill('')
        };
    }

    public componentDidMount() {
        this.passwordModal
            .requestPassword()
            .then(password => {
                this.populateMnemonic(password);
            })
            .catch(() => {
                this.props.navigation.goBack(null);
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
                    subtitle={translate('Password.subtitleMnemonic')}
                    obRef={ref => (this.passwordModal = ref)}
                />
            </View>
        );
    }

    private async populateMnemonic(password) {
        const walletId = this.props.navigation.state?.params?.wallet.id;

        if (!walletId) {
            // TODO show an error?
            this.props.navigation.goBack(null);
        }

        try {
            const wallet = await HDWallet.loadFromStorage(walletId, password);
            const mnemonic = wallet.getMnemonic();

            this.setState({
                mnemonic: mnemonic.split(' ')
            });
        } catch (e) {
            // something went wrong
            this.props.navigation.goBack(null);
        }
    }
}

export const ViewWalletMnemonicScreen = smartConnect(ViewWalletMnemonicScreenComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
