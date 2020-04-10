import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../index';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

/**
 * default:    text and border 'accent' color
 * primary:    filled button with 'accent' color bg
 * secondary:  text and border gray/white
 */

export interface IButtonProps {
    children?: any;
    style?: any;
    primary?: boolean;
    secondary?: boolean;
    disabled?: boolean;
    disabledSecondary?: boolean;
    onPress?: any;
    styles: ReturnType<typeof stylesProvider>;
    onPressIn?: any;
    onPressOut?: any;
}

export const ButtonComponent = (props: IButtonProps) => (
    <TouchableOpacity
        disabled={props.disabled || props.disabledSecondary}
        onPress={props.onPress}
        onPressIn={props.onPressIn}
        onPressOut={props.onPressOut}
        style={[
            props.styles.button,
            props.primary && props.styles.buttonPrimary,
            props.secondary && props.styles.buttonSecondary,
            props.disabled && props.styles.buttonDisabled,
            props.disabledSecondary && props.styles.buttonDisabledSecondary,
            props.style
        ]}
    >
        <Text
            style={[
                props.styles.text,
                props.primary && props.styles.textPrimary,
                props.secondary && props.styles.textSecondary,
                props.disabled && props.styles.textDisabled,
                props.disabledSecondary && props.styles.textDisabledSecondary
            ]}
        >
            {props.children}
        </Text>
    </TouchableOpacity>
);

export const Button = withTheme(stylesProvider)(ButtonComponent);
