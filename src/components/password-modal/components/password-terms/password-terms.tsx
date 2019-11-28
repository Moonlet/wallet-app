import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Button, Checkbox, Text } from '../../../../library';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { translate } from '../../../../core/i18n';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { HeaderLeft } from '../../../header-left/header-left';

export interface IExternalProps {
    onAcknowledged: () => any;
}

export const PasswordTermsComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [acknowledged, setAcknowledged] = useState(false);

    return (
        <View>
            <HeaderLeft
                icon="close"
                text={translate('App.labels.close')}
                onPress={() => {
                    this.setState({
                        visible: false
                    });
                    this.passwordRequestDeferred && this.passwordRequestDeferred.reject();
                }}
            />
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
                        <Image source={require('../../../../assets/images/png/shield.png')} />
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
                            props.onAcknowledged();
                        }}
                    >
                        {translate('App.labels.understand')}
                    </Button>
                </View>
            </View>
        </View>
    );
};

export const PasswordTerms = smartConnect<IExternalProps>(PasswordTermsComponent, [
    withTheme(stylesProvider)
]);
