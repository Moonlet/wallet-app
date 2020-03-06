import React from 'react';
import { ITokenIcon } from '../../core/blockchain/types/token';
import { smartConnect } from '../../core/utils/smart-connect';
import { ICON_SIZE } from '../../styles/dimensions';

interface ISmartImageProps {
    source: ITokenIcon;
    small?: boolean;
    resizeMode?: ResizeMode;
    style?: any;
}

enum ResizeMode {
    contain = 'contain',
    cover = 'cover',
    stretch = 'stretch',
    center = 'center'
}

export const SmartImageComponent = (props: ISmartImageProps) => {
    const iconSmallSize = ICON_SIZE;
    const iconLargeSize = ICON_SIZE + ICON_SIZE / 2;

    const source = props.source?.iconComponent || props.source?.uri;

    const baseStyle = {
        width: props.small ? iconSmallSize : iconLargeSize,
        height: props.small ? iconSmallSize : iconLargeSize
    };

    if (source === undefined) {
        return <div />;
    } else {
        return <img src={source} style={{ ...baseStyle, ...props.style }} />;
    }
};

export const SmartImage = smartConnect<ISmartImageProps>(SmartImageComponent);
