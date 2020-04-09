import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../index';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon';
import { normalize, BASE_DIMENSION } from '../../styles/dimensions';

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
    leftIcon?: string;
}

export const ButtonComponent = (props: IButtonProps) => (
    <TouchableOpacity
        disabled={props.disabled || props.disabledSecondary}
        onPress={props.onPress}
        style={[
            props.styles.button,
            props.primary && props.styles.buttonPrimary,
            props.secondary && props.styles.buttonSecondary,
            props.disabled && props.styles.buttonDisabled,
            props.disabledSecondary && props.styles.buttonDisabledSecondary,
            props.style,
            {
                paddingVertical: props?.leftIcon ? BASE_DIMENSION : BASE_DIMENSION + BASE_DIMENSION
            }
        ]}
    >
        {props?.leftIcon && (
            <Icon name={props.leftIcon} size={normalize(32)} style={props.styles.leftIcon} />
        )}
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
