import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { TC } from '../../components/legal/terms-conditions/terms-conditions';

export const navigationOptions = () => ({
    title: translate('App.labels.tc')
});

export const TermsConditionsScreenComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View style={props.styles.container}>
            <TC />
        </View>
    );
};

TermsConditionsScreenComponent.navigationOptions = navigationOptions;

export const TermsConditionsScreen = smartConnect(TermsConditionsScreenComponent, [
    withTheme(stylesProvider)
]);
