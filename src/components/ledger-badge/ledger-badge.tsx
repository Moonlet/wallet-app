import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { IWalletHWOptions } from '../../redux/wallets/state';
import Icon from '../icon/icon';
import { IconValues } from '../icon/values';
import { normalize } from '../../styles/dimensions';

interface IExternalProps {
    hwOptions: IWalletHWOptions;
}

export const LedgerBadgeComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { hwOptions, styles } = props;

    if (hwOptions) {
        return (
            <View testID="ledger-badge" style={styles.container}>
                <Text style={props.styles.text}>{translate('App.labels.youAreUsing')}</Text>
                <Icon name={IconValues.LEDGER_LOOGO} size={normalize(16)} style={styles.icon} />
                <Text style={styles.text}>
                    {translate(`LedgerConnect.${hwOptions.deviceModel}`)}
                </Text>
            </View>
        );
    } else {
        return <View />;
    }
};

export const LedgerBadge = smartConnect<IExternalProps>(LedgerBadgeComponent, [
    withTheme(stylesProvider)
]);
