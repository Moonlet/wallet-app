import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IOneLineTextBannerData, IScreenModule } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';

interface IExternalProps {
    module: IScreenModule;
}

const OneLineTextBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IOneLineTextBannerData;

    return (
        <View style={[styles.container, module?.style && formatStyles(module.style)]}>
            {formatDataJSXElements(data.line, styles.text)}
        </View>
    );
};

export const OneLineTextBanner = smartConnect<IExternalProps>(OneLineTextBannerComponent, [
    withTheme(stylesProvider)
]);
