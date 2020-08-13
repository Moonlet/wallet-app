import React from 'react';
// import { View, Image } from 'react-native';
// import stylesProvider from './styles';
// import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
// import { Button, Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { AddNearAccount } from '../../../../components/blockchain/near/add-account/add-account';

export const AddNearAccountComponent = () =>
    // props: IThemeProps<ReturnType<typeof stylesProvider>>
    {
        // const { styles } = props;

        return <AddNearAccount />;
    };

export const AddNearAccountScreen = smartConnect(AddNearAccountComponent, [
    // withTheme(stylesProvider)
]);
