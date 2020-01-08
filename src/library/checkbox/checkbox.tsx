import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../index';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon';

export interface ICheckboxProps {
    children?: any;
    style?: any;
    text?: string;
    disabled?: boolean;
    checked?: boolean;
    onPress?: any;
    styles: ReturnType<typeof stylesProvider>;
}

export const CheckboxComponent = (props: ICheckboxProps) => (
    <TouchableOpacity
        disabled={props.disabled}
        onPress={props.onPress}
        style={[props.styles.container, props.style]}
    >
        <Icon
            name={props.checked ? 'check-2-thicked' : 'check-2'}
            size={18}
            style={props.styles.icon}
        />
        {props.text && <Text style={props.styles.text}>{props.text}</Text>}
    </TouchableOpacity>
);

export const Checkbox = withTheme(stylesProvider)(CheckboxComponent);
