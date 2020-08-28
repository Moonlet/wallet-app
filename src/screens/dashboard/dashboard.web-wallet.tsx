import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { INavigationProps } from '../../navigation/with-navigation-params';
import stylesProvider from './styles.web-wallet';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';

export class DashboardScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <Text>{`Welcome to Moonlet Web Wallet!`}</Text>
            </View>
        );
    }
}

export const DashboardScreen = smartConnect(DashboardScreenComponent, [withTheme(stylesProvider)]);
