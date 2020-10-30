import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IBalanceGridData } from '../../types';
import { SmartImage } from '../../../../library/image/smart-image';
import { formatDataJSXElements } from '../../utils';

interface IExternalProps {
    data: IBalanceGridData;
}

const SingleBalanceIconComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { data, styles } = props;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <SmartImage source={{ uri: data.icon.value }} />
            </View>
            <View style={styles.row}>{formatDataJSXElements(data.balance, styles.text)}</View>
        </View>
    );
};

export const SingleBalanceIcon = smartConnect<IExternalProps>(SingleBalanceIconComponent, [
    withTheme(stylesProvider)
]);
