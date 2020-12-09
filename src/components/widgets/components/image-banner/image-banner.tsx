import React from 'react';
import { TouchableOpacity } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { ResizeMode } from '../../../../library/image/smart-image';
import { IImageBannerData, IScreenModule, ISmartScreenActions } from '../../types';
import { formatStyles } from '../../utils';
import { FastImage } from '../../../../library/fast-image/fast-image';

interface IExternalProps {
    module: IScreenModule;
    actions: ISmartScreenActions;
}

class ImageBannerComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public render() {
        const { actions, module, styles } = this.props;
        const data = module.data as IImageBannerData;

        let aspectRatio = 1;
        if (data?.image?.width && data?.image?.height) {
            aspectRatio = data.image.width / data.image.height;
        }

        // Used this in order not to crash in case of api rollback
        const uri = data?.image?.url || (data as any)?.imageUrl;

        // Hide image banner if uri does not exist
        if (!uri) return null;

        const moduleJSX = (
            <FastImage
                style={[{ aspectRatio }, styles.image, formatStyles(module?.style)]}
                source={{ uri }}
                resizeMode={ResizeMode.contain}
            />
        );

        if (module?.cta) {
            return (
                <TouchableOpacity onPress={() => actions.handleCta(module.cta)} activeOpacity={0.9}>
                    {moduleJSX}
                </TouchableOpacity>
            );
        } else {
            return moduleJSX;
        }
    }
}

export const ImageBanner = smartConnect<IExternalProps>(ImageBannerComponent, [
    withTheme(stylesProvider)
]);
