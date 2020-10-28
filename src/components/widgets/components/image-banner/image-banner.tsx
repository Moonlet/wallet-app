import React from 'react';
import { TouchableOpacity } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { openURL } from '../../../../core/utils/linking-handler';
import { ResizeMode, SmartImage } from '../../../../library/image/smart-image';

interface IExternalProps {
    imageUrl: string;
    urlToOpen: string;
}

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}

const ImageBannerComponent: React.FC<Props & IExternalProps> = ({
    imageUrl,
    urlToOpen,
    styles
}) => {
    return (
        <TouchableOpacity onPress={() => openURL(urlToOpen)}>
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
