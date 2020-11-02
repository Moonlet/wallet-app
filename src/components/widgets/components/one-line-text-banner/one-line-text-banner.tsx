import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IOneLineTextBannerData } from '../../types';
import { formatDataJSXElements } from '../../utils';

interface IExternalProps {
    data: IOneLineTextBannerData;
}

const OneLineTextBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { data, styles } = props;

    return <View style={styles.container}>{formatDataJSXElements(data.line, styles.text)}</View>;
};

export const OneLineTextBanner = smartConnect<IExternalProps>(OneLineTextBannerComponent, [
    withTheme(stylesProvider)
]);
