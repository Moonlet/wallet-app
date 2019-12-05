import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { NavigationParams, NavigationState } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Text } from '../../library';
import { Icon } from '../../components/icon';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { appSetTosVersion } from '../../redux/app/actions';
import { TOS_VERSION } from '../../core/constants/app';

export interface IProps {
    navigation: NavigationStackProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    appSetTosVersion: (n: number) => void;
}

export const CreateWalletTermsScreenComponent = (props: IProps & IReduxProps) => (
    <View style={props.styles.container}>
        <View style={props.styles.topContainer}>
            <Text style={props.styles.walletTos}>{translate('CreateWalletTos.body')}</Text>
            <View style={props.styles.docImageContainer}>
                <Image
                    resizeMode="contain"
                    source={require('../../assets/images/png/document.png')}
                />
            </View>
        </View>

        <View style={props.styles.bottomContainer}>
            <TouchableOpacity
                testID="button-tos"
                style={props.styles.rowContainer}
                onPress={() => props.navigation.navigate('TermsConditions')}
            >
                <Text style={props.styles.text}>{translate('App.labels.tc')}</Text>
                <Icon name="arrow-right-1" size={16} style={props.styles.icon} />
            </TouchableOpacity>
            <View style={props.styles.divider} />

            <TouchableOpacity
                testID="button-privacy-policy"
                style={props.styles.rowContainer}
                onPress={() => props.navigation.navigate('PrivacyPolicy')}
            >
                <Text style={props.styles.text}>{translate('App.labels.privacyPolicy')}</Text>
                <Icon name="arrow-right-1" size={16} style={props.styles.icon} />
            </TouchableOpacity>
            <View style={props.styles.divider} />
            <Button
                testID="button-accept"
                style={props.styles.bottomButton}
                primary
                onPress={() => {
                    props.appSetTosVersion(TOS_VERSION);
                    props.navigation.pop();
                }}
            >
                {translate('App.labels.accept')}
            </Button>
        </View>
    </View>
);

export const navigationOptions = () => ({
    title: translate('App.labels.legal'),
    headerLeft: null
});

CreateWalletTermsScreenComponent.navigationOptions = navigationOptions;

export const CreateWalletTermsScreen = smartConnect(CreateWalletTermsScreenComponent, [
    connect(null, dispatch => ({
        appSetTosVersion: (tosVersion: number) => dispatch(appSetTosVersion(tosVersion))
    })),
    withTheme(stylesProvider)
]);
