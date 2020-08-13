import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { AddNearAccount } from '../../../../components/blockchain/near/add-account/add-account';
import { translate } from '../../../../core/i18n';

const navigationOptions = () => ({ title: translate('AddAccount.title') });

export const AddNearAccountComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    const { styles } = props;

    return (
        <View style={styles.container}>
            <AddNearAccount />
        </View>
    );
};

AddNearAccountComponent.navigationOptions = navigationOptions;

export const AddNearAccountScreen = smartConnect(AddNearAccountComponent, [
    withTheme(stylesProvider)
]);
