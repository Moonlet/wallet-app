import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from '../../library';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    NavigationActions
} from 'react-navigation';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { createHDWallet } from '../../redux/wallets/actions';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { hash } from '../../core/secure/encrypt';
import { setPassword } from '../../core/secure/keychain';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    createHDWallet: (mnemonic: string, password: string, callback: () => any) => void;
}

export class OnboardingScreenComponent extends React.Component<IProps & IReduxProps> {
    public mnemonic = [
        'pigeon',
        'road',
        'portion',
        'echo',
        'robust',
        'panel',
        'fat',
        'dune',
        'direct',
        'flee',
        'pave',
        'tonight',
        'govern',
        'blue',
        'tree',
        'actual',
        'palace',
        'rude',
        'legal',
        'sand',
        'width',
        'clever',
        'order',
        'icon'
    ];

    public onPressRecover() {
        this.props.navigation.navigate(
            'CreateWalletNavigation',
            {},
            NavigationActions.navigate({
                routeName: 'RecoverWallet',
                params: {
                    goBack: (
                        navigation: NavigationScreenProp<NavigationState, NavigationParams>
                    ) => {
                        navigation.navigate('OnboardingScreen');
                    }
                }
            })
        );
    }
    public onPressCreate() {
        this.props.navigation.navigate(
            'CreateWalletNavigation',
            {},
            NavigationActions.navigate({
                routeName: 'CreateWalletMnemonic',
                params: {
                    goBack: (
                        navigation: NavigationScreenProp<NavigationState, NavigationParams>
                    ) => {
                        navigation.navigate('OnboardingScreen');
                    }
                }
            })
        );
    }
    public async onPressGenerateWallet() {
        const password = await hash('123456');
        setPassword(password);
        this.props.createHDWallet(this.mnemonic.join(' '), password, () =>
            this.props.navigation.navigate(
                'MainNavigation',
                {},
                NavigationActions.navigate({ routeName: 'Dashboard' })
            )
        );
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View
                        style={{
                            alignItems: 'center',
                            alignSelf: 'stretch'
                        }}
                    >
                        <Image
                            style={styles.logoImage}
                            source={require('../../assets/images/png/moonlet_space.png')}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text large style={{ fontWeight: 'bold' }}>
                            Welcome to Moonlet!
                        </Text>
                        <Text style={{ textAlign: 'center', marginTop: 12 }} darker>
                            We’ll generate this section once you create, recover or connect a wallet
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            style={styles.button}
                            onPress={() => this.onPressRecover()}
                            testID="button-recover"
                        >
                            Recover
                        </Button>
                        <Button style={styles.button}>Connect</Button>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            testID="button-create"
                            style={styles.bottomButton}
                            primary
                            onPress={() => this.onPressCreate()}
                        >
                            Create
                        </Button>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            testID="button-generate"
                            style={styles.bottomButton}
                            primary
                            onPress={() => this.onPressGenerateWallet()}
                        >
                            Generate wallet
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

export const OnboardingScreen = smartConnect(OnboardingScreenComponent, [
    connect((state: IReduxState) => ({}), {
        createHDWallet
    }),
    withTheme(stylesProvider)
]);
