import React from 'react';
import FastImage from 'react-native-fast-image';
import { ITokenIcon } from '../../core/blockchain/types/token';
import { smartConnect } from '../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { View } from 'react-native';

export interface ISmartImageProps {
    source: ITokenIcon;
    small?: boolean;
    resizeMode?: ResizeMode;
    style?: any;
}

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
}

export enum ResizeMode {
    contain = 'contain',
    cover = 'cover',
    stretch = 'stretch',
    center = 'center'
}

// TODO make this component more generic, and create a new Component for Icons
export const SmartImageComponent = (
    props: ISmartImageProps & IProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const style = props?.small ? props.styles.small : props.styles.large;
    if (props.source?.iconComponent) {
        const IconComponent = props.source.iconComponent;
        const width = props?.style?.width || style.width;
        const height = props?.style?.height || style.height;

        return (
            <IconComponent
                width={width}
                height={height}
                style={[props.styles.icon, style, props.style]}
            />
        );
    } else if (props.source?.uri) {
        return (
            <FastImage
                source={props.source}
                style={[props.styles.icon, style, props.style]}
                resizeMode={props?.resizeMode || ResizeMode.contain}
            />
        );
    } else return <View />;
};

export const SmartImage = smartConnect<ISmartImageProps>(SmartImageComponent, [
    withTheme(stylesProvider)
]);
