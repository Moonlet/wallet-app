import React from 'react';
import { View, Image } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export const ImageCanvasComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    return (
        <View style={props.styles.container}>
            <Image
                style={props.styles.image}
                source={require('../../assets/images/png/moonlet_space.png')}
            />
        </View>
    );
};

export const ImageCanvas = smartConnect(ImageCanvasComponent, [withTheme(stylesProvider)]);
