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

export enum ResizeMode {
    contain = 'contain',
    cover = 'cover',
    stretch = 'stretch',
    center = 'center'
}

export const SmartImageComponent = (props: ISmartImageProps) => {
    const iconSmallSize = ICON_SIZE;
    const iconLargeSize = ICON_SIZE + ICON_SIZE / 2;

    const baseStyle = {
        width: props.small ? iconSmallSize : iconLargeSize,
        height: props.small ? iconSmallSize : iconLargeSize
    };

    if (props.source?.iconComponent) {
        return (
            <img
                src={String(props.source.iconComponent)}
                style={{ ...baseStyle, ...props.style, alignSelf: 'center' }}
            />
        );
    } else if (props.source?.uri) {
        return (
            <img
                src={props.source.uri}
                style={{ ...baseStyle, ...props.style, alignSelf: 'center' }}
            />
        );
    } else {
        return <div />;
    }
};

export const SmartImage = smartConnect<ISmartImageProps>(SmartImageComponent);
