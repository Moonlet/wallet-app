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
                onPress={() => NavigationService.navigate('CreateNearAccount', {})}
                wrapperStyle={styles.recoverButton}
            >
                {translate('AddNearAccount.recoverUsername')}
            </Button>

            <Button primary onPress={() => NavigationService.navigate('RecoverNearAccount', {})}>
                {translate('AddNearAccount.createUsername')}
            </Button>
        </View>
    );
};

export const AddNearAccount = smartConnect(AddNearAccountComponent, [withTheme(stylesProvider)]);
