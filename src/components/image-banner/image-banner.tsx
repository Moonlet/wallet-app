import React from 'react';
import { TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';

interface ExternalProps {
    imageUrl: string;
    urlToOpen: string;
}

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}

const ImageBannerComponent: React.FC<Props & ExternalProps> = ({ imageUrl, styles, urlToOpen }) => {
    const linkHandler = () => {
        Linking.canOpenURL(urlToOpen)
            .then(() => Linking.openURL(urlToOpen))
            .catch(error => Alert.alert(error));
    };

    return (
        <TouchableOpacity style={styles.container} onPress={linkHandler}>
            <Image style={styles.image} source={{ uri: imageUrl }} />
        </TouchableOpacity>
    );
};

export const ImageBanner = smartConnect<ExternalProps>(ImageBannerComponent, [
    withTheme(stylesProvider)
]);
