import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Button, Checkbox, Text } from '../../../../library';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { translate } from '../../../../core/i18n';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { SafeAreaView } from 'react-navigation';
import { ICON_SIZE } from '../../../../styles/dimensions';
import { Icon } from '../../../icon';

export interface IExternalProps {
    onAcknowledged: () => void;
    allowBackButton: boolean;
    onBackButtonTap: () => void;
}

export const PasswordTermsComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [acknowledged, setAcknowledged] = useState(false);

    return (
        <SafeAreaView forceInset={{ bottom: 'never' }} style={props.styles.container}>
            {props.allowBackButton && (
                <TouchableOpacity
                    onPress={() => props.onBackButtonTap()}
                    style={props.styles.backIconContainer}
                >
                    <Icon name="close" size={ICON_SIZE} style={props.styles.backIcon} />
                </TouchableOpacity>
            )}

            <View style={props.styles.content}>
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
                        wrapperStyle={props.styles.bottomButton}
                        primary
                        disabled={!acknowledged}
                        onPress={() => props.onAcknowledged()}
                    >
                        {translate('App.labels.understand')}
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
};

export const PasswordTerms = smartConnect<IExternalProps>(PasswordTermsComponent, [
    withTheme(stylesProvider)
]);
