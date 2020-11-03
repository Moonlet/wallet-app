import React from 'react';
import { TouchableOpacity } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { openURL } from '../../../../core/utils/linking-handler';
import { ResizeMode, SmartImage } from '../../../../library/image/smart-image';
import { IImageBannerData, IScreenModule } from '../../types';

interface IExternalProps {
    module: IScreenModule;
}

const ImageBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IImageBannerData;
    const imageUrl = data.imageUrl;
    const urlToOpen = module.cta.params.url;

    return (
        <TouchableOpacity onPress={() => openURL(urlToOpen)} activeOpacity={0.9}>
            <SmartImage
                style={styles.image}
                source={{ uri: imageUrl }}
                resizeMode={ResizeMode.contain}
            />
        </TouchableOpacity>
    );
};

export const ImageBanner = smartConnect<IExternalProps>(ImageBannerComponent, [
    withTheme(stylesProvider)
]);
