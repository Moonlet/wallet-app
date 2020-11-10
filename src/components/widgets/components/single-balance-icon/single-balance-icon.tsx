import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IBalanceGridData, IScreenModule } from '../../types';
import { SmartImage } from '../../../../library/image/smart-image';
import { formatDataJSXElements, formatStyles } from '../../utils';

interface IExternalProps {
    module: IScreenModule;
}

const SingleBalanceIconComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IBalanceGridData;

    return (
        <View style={[styles.container, module?.style && formatStyles(module.style)]}>
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
