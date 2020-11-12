import React from 'react';
import { TouchableOpacity } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { ResizeMode, SmartImage } from '../../../../library/image/smart-image';
import { IImageBannerData, IScreenModule } from '../../types';
import { formatStyles } from '../../utils';

interface IExternalProps {
    module: IScreenModule;
    actions: any;
}

const ImageBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { actions, module, styles } = props;
    const data = module.data as IImageBannerData;

    return (
        <TouchableOpacity
            onPress={() => actions.handleCta(module.cta)}
            activeOpacity={0.9}
            style={module?.style && formatStyles(module.style)}
        >
            <SmartImage
                style={styles.image}
                source={{ uri: data.imageUrl }}
                resizeMode={ResizeMode.contain}
            />
        </TouchableOpacity>
    );
};

export const ImageBanner = smartConnect<IExternalProps>(ImageBannerComponent, [
    withTheme(stylesProvider)
]);
