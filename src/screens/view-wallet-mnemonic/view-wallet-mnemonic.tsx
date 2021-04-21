import React from 'react';
import { View, Clipboard } from 'react-native';
import { Text } from '../../library';
import { Button } from '../../library/button/button';
import { Icon } from '../../components/icon/icon';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { smartConnect } from '../../core/utils/smart-connect';
import { PasswordModal } from '../../components/password-modal/password-modal';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { IWalletState } from '../../redux/wallets/state';
import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { ICON_SIZE } from '../../styles/dimensions';
import { allowScreenshots, forbidScreenshots } from '../../core/utils/screenshot';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { isFeatureActive } from '../../core/utils/remote-feature-config/remote-feature-config';
import { IconValues } from '../../components/icon/values';
import { RemoteFeature } from '../../core/utils/remote-feature-config/types';

export interface INavigationParams {
    wallet: IWalletState;
}

interface IState {
    mnemonic: string[];
    copied: boolean;
    isLoading: boolean;
    unveilMnemonic: boolean;
}

export const navigationOptions = () => ({
    title: translate('Wallets.viewPhrase')
});

export class ViewWalletMnemonicScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: any) {
        super(props);
        this.state = {
            mnemonic: new Array(24).fill(''),
            copied: false,
            isLoading: true,
            unveilMnemonic: false
        };

        forbidScreenshots();
    }

    public async componentDidMount() {
        try {
            const password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleMnemonic')
            );
            this.populateMnemonic(password);
        } catch (err) {
            this.props.navigation.goBack(null);
        }
    }

    public componentWillUnmount() {
        allowScreenshots();
    }

    public render() {
        const { styles } = this.props;
        const { copied, isLoading } = this.state;

        return (
            <View style={styles.container}>
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <React.Fragment>
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
                                                        {`${i + k + 1}. ${
                                                            this.state.unveilMnemonic
                                                                ? w
                                                                : '********'
                                                        }`}
                                                    </Text>
                                                ))}
                                            </View>
                                        ];
                                    }
                                    return out;
                                }, [])}
                            </View>

                            <View style={styles.tipWrapper}>
                                <Icon
                                    name={IconValues.WARNING}
                                    size={ICON_SIZE}
                                    style={styles.alertIcon}
                                />
                                <Text style={styles.tipText}>
                                    {translate('AccountSettings.securityTip')}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bottomContainer}>
                            {isFeatureActive(RemoteFeature.DEV_TOOLS) && (
                                <Button
                                    onPress={() => {
                                        Clipboard.setString(
                                            this.state.mnemonic.toString().replace(/,/g, ' ')
                                        );
                                        this.setState({ copied: true });
                                    }}
                                >
                                    {copied
                                        ? translate('App.buttons.copiedBtn')
                                        : translate('App.buttons.clipboardBtn')}
                                </Button>
                            )}

                            <Button
                                style={styles.unveilButton}
                                onPressIn={() => this.setState({ unveilMnemonic: true })}
                                onPressOut={() =>
                                    setTimeout(() => this.setState({ unveilMnemonic: false }), 250)
                                }
                            >
                                {translate('App.labels.holdUnveil')}
                            </Button>
                        </View>
                    </React.Fragment>
                )}
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
                mnemonic: mnemonic.split(' '),
                isLoading: false
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
