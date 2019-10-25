import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../index';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

export interface IButtonProps {
    children?: any;
    style?: any;
    primary?: boolean;
    onPress?: any;
    styles: ReturnType<typeof stylesProvider>;
}

export const ButtonComponent = (props: IButtonProps) => (
    <TouchableOpacity
        onPress={props.onPress}
        style={[props.styles.button, props.primary && props.styles.buttonPrimary, props.style]}
    >
        <Text style={[props.styles.text, props.primary && props.styles.textPrimary]}>
            {props.children}
        </Text>
    </TouchableOpacity>
);

export const Button = withTheme(stylesProvider)(ButtonComponent);
