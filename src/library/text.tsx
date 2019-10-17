import React from 'react';
import ReactNative from 'react-native';

const defaultStyle = {
    color: '#FFFFFF',
    fontFamily: 'System',
    fontSize: 16
};

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

const Text = (props: any) => {
    return <ReactNative.Text style={mergeStyle(defaultStyle, props.style)} {...getProps(props)} />;
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

export { Text, TextSmall };
