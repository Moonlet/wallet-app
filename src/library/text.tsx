import React from 'react';
import * as ReactNative from 'react-native';

import { withTheme } from '../core/theme/with-theme';
import { ITheme } from '../core/theme/itheme';
import { formatNumber } from '../core/utils/format-number';

// TODO reconsider this

export const defaultStyleProvider = (theme: ITheme) => ({
    color: theme.colors.text,
    fontFamily: 'System',
    fontSize: theme.fontSize.regular
});

const mergeStyle = (baseStyle: any, newStyle: any) => {
    let style;

    if (Array.isArray(newStyle)) {
        style = newStyle.slice();
        style.unshift(baseStyle);
    } else {
        style = { ...baseStyle, ...newStyle };
    }
    return style;
};

export const TextComponent = (props: any) => {
    let text = props.children;

    if (props.format) {
        const amount = parseFloat(text);
        text = formatNumber(amount, props.format);
    }
    return (
        <ReactNative.Text style={mergeStyle(props.styles, props.style)}>{text}</ReactNative.Text>
    );
};

export const TextSmall = (props: any) => {
    // delete props.style;

    return (
        <Text
            children={props.children}
            style={mergeStyle(
                {
                    fontSize: 12
                },
                props.style
            )}
        />
    );
};

export const Text = withTheme(TextComponent, defaultStyleProvider);
