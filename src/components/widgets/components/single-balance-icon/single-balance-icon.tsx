import React from 'react';
import { View, Text, Image } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';

interface IExternalProps {
    data;
}

const SingleBalanceIconComponent: React.FC<IThemeProps<ReturnType<typeof stylesProvider>> &
    IExternalProps> = ({ data, styles }) => {
    return (
        <View style={styles.container}>
            {data.map(item => (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.icon.value }}
                            style={[{ tintColor: item.icon.color }]}
                        />
                    </View>
                    <Text style={styles.labelText}>
                        {item.balance.value + ' ' + item.balance.symbol}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export const SingleBalanceIcon = smartConnect<IExternalProps>(SingleBalanceIconComponent, [
    withTheme(stylesProvider)
]);
