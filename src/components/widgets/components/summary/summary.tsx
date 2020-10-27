import React from 'react';
import { View, Text } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IconValues } from '../../../icon/values';
import { normalize } from '../../../../styles/dimensions';
import Icon from '../../../icon/icon';
import { formatNumber } from '../../../../core/utils/format-number';

interface ExternalProps {
    data;
}

const SummaryComponent: React.FC<IThemeProps<ReturnType<typeof stylesProvider>> &
    ExternalProps> = ({ styles, data }) => {
    // Might need a better imp
    const returnIconName = (iconName: string) => {
        switch (iconName) {
            case 'claim-reward':
                return IconValues.CLAIM_REWARD;
            case 'vote':
                return IconValues.VOTE;
            case 'money-wallet':
                return IconValues.MONEY_WALLET;
            case 'key-lock':
                return IconValues.KEY_LOCK;
        }
    };

    return (
        <View style={styles.container}>
            {data.map(item => (
                <View style={styles.itemContainer}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name={returnIconName(item.icon.value)}
                            size={normalize(28)}
                            style={{ color: item.icon.color, alignSelf: 'center' }}
                        />
                    </View>
                    <View style={styles.labelValuesContainer}>
                        <Text style={styles.valueLabel}>
                            {formatNumber(item.balance.value) + ' ' + item.balance.symbol}
                        </Text>
                        <Text style={styles.labelText}>{item.label}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export const Summary = smartConnect<ExternalProps>(SummaryComponent, [withTheme(stylesProvider)]);
