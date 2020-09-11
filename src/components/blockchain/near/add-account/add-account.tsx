import React from 'react';
import { View, Image } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Button, Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { translate } from '../../../../core/i18n';
import { NavigationService } from '../../../../navigation/navigation-service';

export const AddNearAccountComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    const { styles } = props;

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                style={styles.moonletImage}
            />

            <Text style={styles.title}>{translate('AddNearAccount.title')}</Text>

            <Button
                onPress={() => NavigationService.navigate('RecoverNearAccount', {})}
                wrapperStyle={styles.recoverButton}
            >
                {translate('AddNearAccount.recoverAccount')}
            </Button>

            <Button primary onPress={() => NavigationService.navigate('CreateNearAccount', {})}>
                {translate('AddNearAccount.createAccount')}
            </Button>
        </View>
    );
};

export const AddNearAccount = smartConnect(AddNearAccountComponent, [withTheme(stylesProvider)]);
