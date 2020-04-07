import React from 'react';
import { View, Clipboard } from 'react-native';
import { Text, Checkbox } from '../../library';
import { NavigationActions } from 'react-navigation';
import { Button } from '../../library/button/button';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Mnemonic } from '../../core/wallet/hd-wallet/mnemonic';
import { translate } from '../../core/i18n';
import { smartConnect } from '../../core/utils/smart-connect';
import { allowScreenshots, forbidScreenshots } from '../../core/utils/screenshot';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';

const MNEMONIC_LENGTH = 12;
const NR_MNEMONICS_SCREEN = 4;

export interface INavigationParams {
    mnemonic: string[];
    step: number;
}

interface IState {
    mnemonic: string[];
    copied: boolean;
    accepted: boolean;
}

export const navigationOptions = () => ({
    title: translate('App.labels.create')
});

export class CreateWalletMnemonicScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            mnemonic: new Array(MNEMONIC_LENGTH).fill(''),
            copied: false,
            accepted: false
        };

        forbidScreenshots();
    }

    public async componentDidMount() {
        if (this.props.step === 1) {
            Mnemonic.generate(MNEMONIC_LENGTH).then(mnemonic => {
                this.setState({
                    mnemonic: mnemonic.split(' ')
                });
            });
        } else {
            this.setState({ mnemonic: this.props.mnemonic });
        }
    }

    public componentWillUnmount() {
        allowScreenshots();
    }

    public render() {
        const { styles, navigation } = this.props;
        const indexFrom = this.props.step * NR_MNEMONICS_SCREEN - NR_MNEMONICS_SCREEN;
        const indexTo = this.props.step * NR_MNEMONICS_SCREEN;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {translate('CreateWalletMnemonic.title', { mnemonicLength: MNEMONIC_LENGTH })}
                </Text>

                <View style={styles.mnemonicContainer}>
                    <Text style={styles.mnemonicInfoText}>
                        {translate('CreateWalletMnemonic.mnemonicInfo', {
                            from: indexFrom + 1,
                            to: indexTo
                        })}
                    </Text>

                    {[...Array(NR_MNEMONICS_SCREEN).keys()].map(i => (
                        <Text key={`mnemonic-${i + indexFrom + 1}`} style={styles.secretWord}>
                            {`${i + indexFrom + 1}. ${this.state.mnemonic[indexFrom + i]}`}
                        </Text>
                    ))}
                </View>

                {this.props.step === 1 && (
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            onPress={() => this.setState({ accepted: !this.state.accepted })}
                            checked={this.state.accepted}
                            text={translate('CreateWalletMnemonic.terms')}
                            textStyle={styles.checkboxText}
                        />
                    </View>
                )}

                <View style={styles.bottomContainer}>
                    {isFeatureActive(RemoteFeature.DEV_TOOLS) && this.props.step === 1 && (
                        <Button
                            style={styles.copyButton}
                            onPress={() => {
                                Clipboard.setString(
                                    this.state.mnemonic.toString().replace(/,/g, ' ')
                                );
                                this.setState({ copied: true });
                            }}
                        >
                            {this.state.copied
                                ? translate('App.buttons.copiedBtn')
                                : translate('CreateWalletMnemonic.copy')}
                        </Button>
                    )}

                    <Button
                        testID="button-next"
                        primary
                        onPress={() => {
                            if (this.props.step === MNEMONIC_LENGTH / NR_MNEMONICS_SCREEN) {
                                navigation.navigate('CreateWalletConfirmMnemonic', {
                                    mnemonic: this.state.mnemonic
                                });
                            } else {
                                const navigateAction = NavigationActions.navigate({
                                    routeName: 'CreateWalletMnemonic',
                                    params: {
                                        mnemonic: this.state.mnemonic,
                                        step: this.props.step + 1
                                    },
                                    key: `CreateWalletMnemonic-Step-${this.props.step}`
                                });
                                this.props.navigation.dispatch(navigateAction);
                            }
                        }}
                        disabled={!this.state.accepted && this.props.step === 1}
                    >
                        {translate('App.labels.next')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const CreateWalletMnemonicScreen = smartConnect(CreateWalletMnemonicScreenComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
