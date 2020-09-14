import React from 'react';
import { View, Image, Platform } from 'react-native';
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

            <Text style={[styles.title, Platform.OS === 'web' && styles.titleWeb]}>
                {Platform.OS === 'web'
                    ? translate('AddNearAccount.noAccounts')
                    : translate('AddNearAccount.title')}
            </Text>

            {Platform.OS === 'web' && (
                <Text style={styles.subtitleWeb}>
                    {translate('AddNearAccount.enableSectionWeb')}
                </Text>
            )}

            {Platform.OS !== 'web' && (
                <Button
                    onPress={() => NavigationService.navigate('RecoverNearAccount', {})}
                    wrapperStyle={styles.recoverButton}
                >
                    {translate('AddNearAccount.recoverAccount')}
                </Button>
            )}

            {Platform.OS !== 'web' && (
                <Button primary onPress={() => NavigationService.navigate('CreateNearAccount', {})}>
                    {translate('AddNearAccount.createAccount')}
                </Button>
            )}
        </View>
    );
};

export const AddNearAccount = smartConnect(AddNearAccountComponent, [withTheme(stylesProvider)]);
