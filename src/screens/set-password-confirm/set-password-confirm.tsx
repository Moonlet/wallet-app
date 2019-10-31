import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button } from '../../library/button/button';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Text } from '../../library';
import { ITheme } from '../../core/theme/itheme';
import { Icon } from '../../components/icon';
import { translate } from '../../core/i18n';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export const SetPasswordConfirmScreenComponent = (props: IProps) => {
    const [acknowledged, setAcknowledged] = useState(false);

    return (
        <View style={props.styles.container}>
            <View style={props.styles.topContainer}>
                <Text darker style={{ textAlign: 'center', marginTop: 60 }}>
                    {translate('SetPasswordConfirm.body')}
                </Text>
                <View
                    style={{
                        alignItems: 'center',
                        alignSelf: 'stretch',
                        marginTop: 40
                    }}
                >
                    <Image source={require('../../assets/images/png/shield.png')} />
                </View>
            </View>
            <View style={props.styles.bottomContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setAcknowledged(!acknowledged);
                    }}
                    style={props.styles.confirmTextContainer}
                >
                    <Icon
                        name={acknowledged ? 'check-2-thicked' : 'check-2'}
                        size={18}
                        style={props.styles.icon}
                    />

                    <Text darker>{translate('SetPasswordConfirm.checkboxLabel')}</Text>
                </TouchableOpacity>
                <Button
                    testID="button-understand"
                    style={props.styles.bottomButton}
                    primary
                    disabled={!acknowledged}
                    onPress={() => {
                        props.navigation.navigate('SetPassword');
                    }}
                >
                    {translate('App.labels.understand')}
                </Button>
            </View>
        </View>
    );
};

export const navigationOptions = {
    title: 'Secure wallet'
};

export const SetPasswordConfirmScreen = withTheme(stylesProvider)(
    SetPasswordConfirmScreenComponent
);

SetPasswordConfirmScreen.navigationOptions = navigationOptions;
