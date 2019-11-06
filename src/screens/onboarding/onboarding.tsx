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

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export class OnboardingScreenComponent extends React.Component<IProps> {
    public onPressCreate() {
        this.props.navigation.navigate(
            'CreateWalletNavigation',
            {},
            NavigationActions.navigate({
                routeName: 'CreateWalletTerms',
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
                        <Button style={styles.button} testID="button-recover">
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
                </View>
            </View>
        );
    }
}

export const OnboardingScreen = withTheme(stylesProvider)(OnboardingScreenComponent);
