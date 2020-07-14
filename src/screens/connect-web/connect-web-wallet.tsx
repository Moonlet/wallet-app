import React from 'react';
import { View } from 'react-native';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import stylesProvider from './styles';

interface IState {
    isConnected: boolean;
    isLoading: boolean;
}

class ConnectWebWalletScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}></View>
            </View>
        );
    }
}

export const ConnectWebWalletScreen = smartConnect(ConnectWebWalletScreenComponent, [
    withTheme(stylesProvider)
]);
