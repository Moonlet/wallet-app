import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export const navigationOptions = () => ({
    title: translate('TransactionRequest.title')
});

export class TransactionRequestScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles } = this.props;

        return <View style={styles.container}></View>;
    }
}

export const TransactionRequestScreen = smartConnect(TransactionRequestScreenComponent, [
    withTheme(stylesProvider)
]);
