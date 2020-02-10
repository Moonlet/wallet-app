import React from 'react';
import { View, Image } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export class ImageCanvasComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={require('../../assets/images/png/moonlet_space.png')}
                />
            </View>
        );
    }
}

export const ImageCanvas = smartConnect(ImageCanvasComponent, [withTheme(stylesProvider)]);
