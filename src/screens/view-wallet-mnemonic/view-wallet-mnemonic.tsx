import React from 'react';
import { View, Clipboard } from 'react-native';
import { Text } from '../../library';
import { Button } from '../../library/button/button';
import { Icon } from '../../components/icon';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { smartConnect } from '../../core/utils/smart-connect';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { IWalletState } from '../../redux/wallets/state';
import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { ICON_SIZE } from '../../styles/dimensions';
import { themes } from '../../navigation/navigation';

export interface INavigationParams {
    wallet: IWalletState;
}

interface IState {
    mnemonic: string[];
    copied: boolean;
}

export const navigationOptions = ({ theme }: any) => ({
    title: translate('Wallets.viewPhrase'),
    headerStyle: {
        backgroundColor: themes[theme].colors.headerBackground
    }
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
            mnemonic: new Array(24).fill(''),
            copied: false
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
        const { styles } = this.props;
        const { copied } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.mnemonicContainer}>
                        {this.state.mnemonic.reduce((out: any, word: string, i: number) => {
                            if (i % 4 === 0) {
                                const line = this.state.mnemonic.slice(i, i + 4);
                                out = [
                                    ...out,
                                    <View style={styles.mnemonicLine} key={i}>
                                        {line.map((w, k) => (
                                            <Text small key={k} style={styles.mnemonicWord}>
                                                {i + k + 1}. {w}
                                            </Text>
                                        ))}
                                    </View>
                                ];
                            }
                            return out;
                        }, [])}
                    </View>

                    <View style={styles.tipWrapper}>
                        <Icon name="warning" size={ICON_SIZE} style={styles.alertIcon} />
                        <Text style={styles.tipText}>
                            {translate('AccountSettings.securityTip')}
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        disabled={copied}
                        onPress={() => {
                            Clipboard.setString(this.state.mnemonic.toString().replace(/,/g, ' '));
                            this.setState({ copied: true });
                        }}
                    >
                        {copied
                            ? translate('App.buttons.copiedBtn')
                            : translate('App.buttons.clipboardBtn')}
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
