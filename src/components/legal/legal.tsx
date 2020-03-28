import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Button } from '../../library/button/button';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Text } from '../../library';
import { Icon } from '../../components/icon';
import { translate } from '../../core/i18n';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { appSetAcceptedTcVersion } from '../../redux/app/actions';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { TC } from './terms-conditions/terms-conditions';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { normalize, ICON_SIZE } from '../../styles/dimensions';
import { SafeAreaView } from 'react-navigation';

interface IExternalProps {
    onAccept: () => void;
    tcLatestVersion: number;
    showClose?: boolean;
    onClose?: () => void;
}

export interface IReduxProps {
    appSetAcceptedTcVersion: typeof appSetAcceptedTcVersion;
}

const mapDispatchToProps = {
    appSetAcceptedTcVersion
};

export const LegalComponent = (
    props: INavigationProps &
        IReduxProps &
        IExternalProps &
        IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [showTC, setShowTC] = useState<boolean>(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);

    if (showTC) {
        return <TC showClose onClose={() => setShowTC(false)} />;
    } else if (showPrivacyPolicy) {
        return <PrivacyPolicy showClose onClose={() => setShowPrivacyPolicy(false)} />;
    } else
        return (
            <SafeAreaView forceInset={{ bottom: 'never' }} style={props.styles.container}>
                {props.showClose && (
                    <TouchableOpacity
                        onPress={() => props.onClose && props.onClose()}
                        style={props.styles.iconContainer}
                    >
                        <Icon name="arrow-left-1" size={ICON_SIZE} style={props.styles.backIcon} />
                    </TouchableOpacity>
                )}

                <View style={props.styles.topContainer}>
                    <Text style={props.styles.walletTc}>{translate('CreateWalletTc.body')}</Text>
                    <Image
                        resizeMode="contain"
                        source={require('../../assets/images/png/document.png')}
                        style={props.styles.docImage}
                    />
                </View>
                <View style={props.styles.bottomContainer}>
                    <TouchableOpacity
                        style={props.styles.rowContainer}
                        onPress={() => setShowTC(true)}
                    >
                        <Text style={props.styles.text} large>
                            {translate('App.labels.tc')}
                        </Text>
                        <Icon name="chevron-right" size={normalize(16)} style={props.styles.icon} />
                    </TouchableOpacity>

                    <View style={props.styles.divider} />

                    <TouchableOpacity
                        style={props.styles.rowContainer}
                        onPress={() => setShowPrivacyPolicy(true)}
                    >
                        <Text style={props.styles.text} large>
                            {translate('App.labels.privacyPolicy')}
                        </Text>
                        <Icon name="chevron-right" size={normalize(16)} style={props.styles.icon} />
                    </TouchableOpacity>

                    <View style={props.styles.divider} />

                    <Button
                        style={props.styles.bottomButton}
                        primary
                        onPress={() => {
                            props.appSetAcceptedTcVersion(props.tcLatestVersion);
                            props.onAccept();
                        }}
                    >
                        {translate('App.labels.accept')}
                    </Button>
                </View>
            </SafeAreaView>
        );
};

export const navigationOptions = () => ({
    title: translate('App.labels.legal'),
    headerLeft: null
});

LegalComponent.navigationOptions = navigationOptions;

export const Legal = smartConnect<IExternalProps>(LegalComponent, [
    connect(null, mapDispatchToProps),
    withTheme(stylesProvider)
]);
