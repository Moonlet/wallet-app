import React from 'react';
import { View, Clipboard } from 'react-native';
import { Text } from '../../library';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Mnemonic } from '../../core/wallet/hd-wallet/mnemonic';
import { translate } from '../../core/i18n';
import { HeaderLeft } from '../../components/header-left/header-left';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { TC_VERSION } from '../../core/constants/app';
import { ICON_SIZE } from '../../styles/dimensions';
import { Icon } from '../../components/icon';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

interface IState {
    mnemonic: string[];
    copied: boolean;
}

export interface IReduxProps {
    tcVersion: number;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        if (navigation.state && navigation.state.params && navigation.state.params.goBack) {
            return (
                <HeaderLeft
                    icon="arrow-left-1"
                    onPress={() => navigation.state.params.goBack(navigation)}
                />
            );
        }

        return null;
    },
    title: translate('App.labels.create')
});

export class CreateWalletMnemonicScreenComponent extends React.Component<
    IProps,
    IState,
    IReduxProps
> {
    public static navigationOptions = navigationOptions;

    constructor(props: any) {
        super(props);
        this.state = {
            mnemonic: new Array(24).fill(''),
            copied: false
        };

        if (!props.tcVersion || TC_VERSION > props.tcVersion) {
            props.navigation.navigate('CreateWalletTerms');
        }
    }

    public async componentDidMount() {
        Mnemonic.generate().then(mnemonic => {
            this.setState({
                mnemonic: mnemonic.split(' ')
            });
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
                                            <Text key={k} style={props.styles.mnemonicWord}>
                                                {`${i + k + 1}. ${w}`}
                                            </Text>
                                        ))}
                                    </View>
                                ];
                            }
                            return out;
                        }, [])}
                    </View>
                    <View style={props.styles.textContainer}>
                        <Icon name="warning" size={ICON_SIZE} style={props.styles.alertIcon} />
                        <Text darker>{translate('CreateWalletMnemonic.body')}</Text>
                    </View>
                </View>
                <View style={props.styles.bottomContainer}>
                    <Button
                        style={props.styles.copyButton}
                        onPress={() => {
                            Clipboard.setString(this.state.mnemonic.toString().replace(/,/g, ' '));
                            this.setState({ copied: true });
                        }}
                    >
                        {this.state.copied
                            ? translate('App.buttons.copiedBtn')
                            : translate('App.labels.copy')}
                    </Button>

                    <Button
                        testID="button-next"
                        primary
                        onPress={() => {
                            props.navigation.navigate('CreateWalletConfirmMnemonic', {
                                mnemonic: this.state.mnemonic
                            });
                        }}
                    >
                        {translate('App.labels.next')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const CreateWalletMnemonicScreen = smartConnect(CreateWalletMnemonicScreenComponent, [
    connect(
        (state: IReduxState) => ({
            tcVersion: state.app.tcVersion
        }),
        null
    ),
    withTheme(stylesProvider)
]);
