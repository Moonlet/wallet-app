import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Button, Checkbox, Text } from '../../../../library';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { translate } from '../../../../core/i18n';
import { smartConnect } from '../../../../core/utils/smart-connect';

export interface IExternalProps {
    onAcknowledged: (data: {}) => any;
    // changePIN: boolean;
}

export const PasswordTermsComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [acknowledged, setAcknowledged] = useState(false);

    return (
        <View style={props.styles.container}>
            {/* !props.changePIN */}
            <Text style={props.styles.textStyle}>{translate('Password.termsBody')}</Text>

            <View style={props.styles.imageStyle}>
                <Image
                    resizeMode="contain"
                    source={require('../../../../assets/images/png/shield.png')}
                />
            </View>
            <View>
                <View style={props.styles.confirmTextContainer}>
                    <Checkbox
                        onPress={() => setAcknowledged(!acknowledged)}
                        checked={acknowledged}
                        text={translate('Password.termsCheckboxLabel')}
                    />
                </View>
                <Button
                    testID="button-understand"
                    style={props.styles.bottomButton}
                    primary
                    disabled={!acknowledged}
                    onPress={() => {
                        props.onAcknowledged({});
                    }}
                >
                    {translate('App.labels.understand')}
                </Button>
            </View>
        </View>
    );
};

export const PasswordTerms = smartConnect<IExternalProps>(PasswordTermsComponent, [
    withTheme(stylesProvider)
]);
