import React from 'react';
import * as ReactNative from 'react-native';

import { formatNumber, INumberFormatOptions } from '../../core/utils/format-number';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

const { width: SCREEN_WIDTH } = ReactNative.Dimensions.get('window');

// based on iPhone 11's scale
const scale = SCREEN_WIDTH / 414;

// can be used for width, height, top, bottom, fontSize, borderRadius, etc.
export const normalize = (size: number) => {
    const newSize = size * scale;
    if (ReactNative.Platform.OS === 'ios') {
        return Math.round(ReactNative.PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(ReactNative.PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
};

export interface ITextProps {
    children?: any;
    style?: any;
    darker?: boolean;
    small?: boolean;
    format?: INumberFormatOptions;
    styles: ReturnType<typeof stylesProvider>;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

const styleModifiers = ['darker', 'small', 'large'];

const getStyle = (props: ITextProps) => {
    // default text style
    let style = [props.styles.default];

    // props texts modifiers
    styleModifiers.forEach((modifier: string) => {
        // @ts-ignore
        props[modifier] && props.styles[modifier] && style.push(props.styles[modifier]);
    });

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

export const TextComponent = (props: ITextProps) => {
    let text = props.children;

    if (props.format) {
        const amount = parseFloat(text);
        text = formatNumber(amount, props.format);
    }
    return (
        <ReactNative.Text
            style={getStyle(props)}
            numberOfLines={props.numberOfLines}
            ellipsizeMode={props.ellipsizeMode}
        >
            {text}
        </ReactNative.Text>
    );
};

export const Text = withTheme(stylesProvider)(TextComponent);
