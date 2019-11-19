import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Button, Checkbox, Text } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
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
                <View style={props.styles.confirmTextContainer}>
                    <Checkbox
                        onPress={() => {
                            setAcknowledged(!acknowledged);
                        }}
                        checked={acknowledged}
                        text={translate('SetPasswordConfirm.checkboxLabel')}
                    />
                </View>
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
    title: 'Secure Wallet'
};

export const SetPasswordConfirmScreen = withTheme(stylesProvider)(
    SetPasswordConfirmScreenComponent
);

SetPasswordConfirmScreen.navigationOptions = navigationOptions;
