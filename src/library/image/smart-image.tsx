import React from 'react';
import FastImage from 'react-native-fast-image';
import { TokenIconType } from '../../core/blockchain/types/token';
import { smartConnect } from '../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { ICON_SIZE } from '../../styles/dimensions';
import { View } from 'react-native';

export interface ISmartImageProps {
    source: TokenIconType;
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

const getStyle = (props: ISmartImageProps & IProps) => {
    // default image style
    let style = [props.styles.icon];

    // style from props
    if (props.style) {
        if (Array.isArray(props.style)) {
            style = style.concat(props.style);
        } else {
            style.push(props.style);
        }
    }

    return style;
};

export const SmartImageComponent = (
    props: ISmartImageProps & IProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    if (props.source?.iconComponent) {
        const IconComponent = props.source.iconComponent;

        const iconSmallSize = ICON_SIZE;
        const iconLargeSize = ICON_SIZE + ICON_SIZE / 2;

        return (
            <IconComponent
                width={props?.small ? iconSmallSize : iconLargeSize}
                height={props?.small ? iconSmallSize : iconLargeSize}
                style={getStyle(props)}
            />
        );
    } else if (props.source?.uri) {
        return (
            <FastImage
                source={props.source}
                style={getStyle(props)}
                resizeMode={props?.resizeMode || ResizeMode.contain}
            />
        );
    } else return <View />;
};

export const SmartImage = smartConnect<ISmartImageProps>(SmartImageComponent, [
    withTheme(stylesProvider)
]);
