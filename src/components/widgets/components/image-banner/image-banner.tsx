import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { ResizeMode } from '../../../../library/image/smart-image';
import { IImageBannerData, IScreenModule, ISmartScreenActions } from '../../types';
import { formatStyles } from '../../utils';
import FastImage from 'react-native-fast-image';

interface IExternalProps {
    module: IScreenModule;
    actions: ISmartScreenActions;
}

interface IState {
    aspectRatio: number;
}

class ImageBannerComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps,
    IState
> {
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps) {
        super(props);
        this.state = {
            aspectRatio: 1
        };
    }

    public componentDidMount() {
        Image.getSize(
            (this.props.module.data as IImageBannerData).imageUrl,
            (width, height) => this.setState({ aspectRatio: width / height }),
            error => {
                // no need to handle
            }
        );
    }

    public render() {
        const { actions, module, styles } = this.props;
        const data = module.data as IImageBannerData;

        const moduleJSX = (
            <FastImage
                style={[
                    { aspectRatio: this.state.aspectRatio },
                    styles.image,
                    formatStyles(module?.style)
                ]}
                source={{ uri: data.imageUrl }}
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
