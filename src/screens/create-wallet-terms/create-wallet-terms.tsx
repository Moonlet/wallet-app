import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { HeaderLeft } from '../../components/header-left/header-left';
import { Text } from '../../library';
import { Icon } from '../../components/icon';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export const CreateWalletTermsScreenComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <View style={props.styles.topContainer}>
            <Text darker style={{ textAlign: 'center', marginTop: 60 }}>
                Make sure you review our Privacy policy and Terms of service
            </Text>
            <View
                style={{
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    marginTop: 40
                }}
            >
                <Image source={require('../../assets/images/png/document.png')} />
            </View>
        </View>

        <View style={props.styles.bottomContainer}>
            <TouchableOpacity
                testID="button-tos"
                style={props.styles.rowContainer}
                onPress={() => props.navigation.navigate('Tos')}
            >
                <Text>Terms of service</Text>
                <View style={props.styles.rightContainer}>
                    <Icon name="arrow-right-1" size={16} style={props.styles.icon} />
                </View>
            </TouchableOpacity>
            <View style={props.styles.divider} />

            <TouchableOpacity
                testID="button-privacy-policy"
                style={props.styles.rowContainer}
                onPress={() => props.navigation.navigate('PrivacyPolicy')}
            >
                <Text>Privacy policy</Text>
                <View style={props.styles.rightContainer}>
                    <Icon name="arrow-right-1" size={16} style={props.styles.icon} />
                </View>
            </TouchableOpacity>
            <View style={props.styles.divider} />
            <Button
                testID="button-accept"
                style={props.styles.bottomButton}
                primary
                onPress={() => {
                    props.navigation.navigate('CreateWalletMnemonic');
                }}
            >
                Accept
            </Button>
        </View>
    </View>
);

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        if (navigation.state && navigation.state.params && navigation.state.params.goBack) {
            return (
                <HeaderLeft
                    icon="arrow-left-1"
                    text="Back"
                    onPress={() => {
                        navigation.state.params.goBack(navigation);
                    }}
                />
            );
        }

        return null;
    },
    title: 'Create'
});

export const CreateWalletTermsScreen = withTheme(stylesProvider)(CreateWalletTermsScreenComponent);

CreateWalletTermsScreen.navigationOptions = navigationOptions;
