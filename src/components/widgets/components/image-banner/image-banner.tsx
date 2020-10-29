import React from 'react';
import { TouchableOpacity } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { openURL } from '../../../../core/utils/linking-handler';
import { ResizeMode, SmartImage } from '../../../../library/image/smart-image';

interface IExternalProps {
    imageUrl: string;
    urlToOpen: string;
}

const ImageBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { imageUrl, urlToOpen, styles } = props;

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
