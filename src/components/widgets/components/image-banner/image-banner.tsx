import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';

interface IExternalProps {
    imageUrl: string;
    urlToOpen: string;
}

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}

const ImageBannerComponent: React.FC<Props & IExternalProps> = ({ imageUrl, styles }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Image style={styles.image} source={{ uri: imageUrl }} />
        </TouchableOpacity>
    );
};

export const ImageBanner = smartConnect<IExternalProps>(ImageBannerComponent, [
    withTheme(stylesProvider)
]);
