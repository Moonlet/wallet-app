import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { PrivacyPolicy } from '../../components/legal/privacy-policy/privacy-policy';

export const navigationOptions = () => ({
    title: translate('App.labels.privacyPolicy')
});

export const PrivacyPolicyScreenComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View style={props.styles.container}>
            <PrivacyPolicy />
        </View>
    );
};

PrivacyPolicyScreenComponent.navigationOptions = navigationOptions;

export const PrivacyPolicyScreen = smartConnect(PrivacyPolicyScreenComponent, [
    withTheme(stylesProvider)
]);
