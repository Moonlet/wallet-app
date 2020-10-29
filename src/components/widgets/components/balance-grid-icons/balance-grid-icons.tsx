import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { normalize } from '../../../../styles/dimensions';
import Icon from '../../../icon/icon';
import { IBalanceGridData } from '../../types';
import { formatDataJSXElements } from '../../utils';

interface IExternalProps {
    data: IBalanceGridData[];
}

const BalanceGridIconsComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { data, styles } = props;

    return (
        <View style={styles.container}>
            {data.map((item: IBalanceGridData, index: number) => {
                return (
                    <View key={`balance-grid-icons-${index}`} style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Icon
                                name={item.icon.value}
                                size={normalize(24)}
                                style={{ color: item.icon.color, alignSelf: 'center' }}
                            />
                        </View>
                        <View style={styles.labelValuesContainer}>
                            <View style={styles.row}>
                                {formatDataJSXElements(item.balance, styles.valueLabel)}
                            </View>
                            <View style={styles.row}>
                                {formatDataJSXElements(item.label, styles.labelText)}
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

export const BalanceGridIcons = smartConnect<IExternalProps>(BalanceGridIconsComponent, [
    withTheme(stylesProvider)
]);
