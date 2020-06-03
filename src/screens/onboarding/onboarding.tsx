import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from '../../library';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    NavigationActions,
    StackActions
} from 'react-navigation';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { createHDWallet } from '../../redux/wallets/actions';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { generateEncryptionKey } from '../../core/secure/keychain/keychain';
import { translate } from '../../core/i18n';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';
import { LoadingModal } from '../../components/loading-modal/loading-modal';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    createHDWallet: typeof createHDWallet;
}

const mapDispatchToProps = {
    createHDWallet
};

const navigationOptions = () => ({ header: null });

export class OnboardingScreenComponent extends React.Component<IProps & IReduxProps> {
    public static navigationOptions = navigationOptions;

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
        this.props.navigation.navigate('RecoverWallet');
    }
    public onPressCreate() {
        this.props.navigation.navigate('CreateWalletMnemonic', {
            mnemonic: undefined,
            step: 1
        });
    }

    public onPressConnect() {
        this.props.navigation.navigate('ConnectHardwareWallet');
    }

    public async onPressGenerateWallet() {
        await LoadingModal.open();
        await generateEncryptionKey('000000');
        this.props.createHDWallet(this.mnemonic.join(' '), '000000', () => {
            this.props.navigation.dispatch(StackActions.popToTop());
            this.props.navigation.navigate(
                'MainNavigation',
                {},
                NavigationActions.navigate({ routeName: 'Dashboard' })
            );
        });
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View testID="onboarding-screen" style={styles.container}>
                <View style={styles.topContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require('../../assets/images/png/moonlet_space.png')}
                    />

                    <View style={styles.textContainer}>
                        <Text style={styles.welcomeTitle}>
                            {translate('Onboarding.welcomeTitle')}
                        </Text>
                        <Text style={styles.welcomeText}>
                            {translate('Onboarding.welcomeText')}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <View style={styles.topButtons}>
                        <Button
                            testID="recover-button"
                            style={[styles.leftButton]}
                            wrapperStyle={{ flex: 1 }}
                            onPress={() => this.onPressRecover()}
                        >
                            {translate('App.labels.recover')}
                        </Button>
                        <Button
                            style={[styles.rightButton]}
                            wrapperStyle={{ flex: 1 }}
                            onPress={() => this.onPressConnect()}
                        >
                            {translate('App.labels.connect')}
                        </Button>
                    </View>

                    <Button
                        testID="create-button"
                        style={styles.bottomButton}
                        primary
                        onPress={() => this.onPressCreate()}
                    >
                        {translate('App.labels.create')}
                    </Button>

                    {isFeatureActive(RemoteFeature.DEV_TOOLS) && (
                        <Button
                            testID="button-generate"
                            style={styles.bottomButton}
                            primary
                            onPress={() => this.onPressGenerateWallet()}
                        >
                            {`Generate wallet`}
                        </Button>
                    )}
                </View>
            </View>
        );
    }
}

export const OnboardingScreen = smartConnect(OnboardingScreenComponent, [
    connect(null, mapDispatchToProps),
    withTheme(stylesProvider)
]);
