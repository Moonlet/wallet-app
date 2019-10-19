import React from 'react';
import ReactNative from 'react-native';

import { withTheme } from '../core/theme/with-theme';
import { ITheme } from '../core/theme/itheme';

// TODO refactor this

const defaultStyleProvider = (theme: ITheme) => ({
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

const getProps = (props: any) => ({
    children: props.children
});

const TextComponent = (props: any) => {
    return <ReactNative.Text style={mergeStyle(props.styles, props.style)} {...getProps(props)} />;
};

const TextSmall = (props: any) => {
    delete props.style;

    return (
        <Text
            {...getProps(props)}
            style={mergeStyle(
                {
                    fontSize: 12
                },
                props.style
            )}
        />
    );
};

const Text = withTheme(TextComponent, defaultStyleProvider);

export { Text, TextSmall };
