import React from 'react';
import { Image, View } from 'react-native';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { IReduxState } from '../../redux/state';
import { translate } from '../../core/i18n';
import { Text } from '../../library';

import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { themes } from '../../navigation/navigation';

export const mapStateToProps = (state: IReduxState) => {
    return {
        //
    };
};

export const navigationOptions = ({ theme }: any) => ({
    title: translate('App.labels.privacyPolicy'),
    headerStyle: {
        backgroundColor: themes[theme].colors.header
    }
});

export class PrivacyPolicyScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.logoImage}
                    source={require('../../assets/images/png/moonlet_space.png')}
                />
                <Text style={styles.launchingSoonText}>{translate('Rewards.launchingSoon')}</Text>
            </View>
        );
    }
}

export const PrivacyPolicyScreen = smartConnect(PrivacyPolicyScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
