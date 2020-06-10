import React from 'react';
import * as ReactNative from 'react-native';

import { formatNumber, INumberFormatOptions } from '../../core/utils/format-number';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';

export interface IExternalProps {
    children?: any;
    style?: any;
    darker?: boolean;
    small?: boolean;
    large?: boolean;
    format?: INumberFormatOptions;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    isAnimated?: boolean;
    testID?: string;
}

export interface ITextProps {
    styles: ReturnType<typeof stylesProvider>;
}

const styleModifiers = ['darker', 'small', 'large'];

const getStyle = (props: IExternalProps & ITextProps) => {
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

export const TextComponent = (props: IExternalProps & ITextProps) => {
    let text = props.children;

    if (props.format) {
        const amount = parseFloat(text);
        text = formatNumber(amount, props.format);
    }

    if (props?.isAnimated) {
        return (
            <ReactNative.Animated.Text
                testID={props?.testID || 'text'}
                style={getStyle(props)}
                numberOfLines={props.numberOfLines}
                ellipsizeMode={props.ellipsizeMode}
            >
                {text}
            </ReactNative.Animated.Text>
        );
    } else {
        return (
            <ReactNative.Text
                testID={props?.testID || 'text'}
                style={getStyle(props)}
                numberOfLines={props.numberOfLines}
                ellipsizeMode={props.ellipsizeMode}
            >
                {text}
            </ReactNative.Text>
        );
    }
};

export const Text = smartConnect<IExternalProps>(TextComponent, [withTheme(stylesProvider)]);
