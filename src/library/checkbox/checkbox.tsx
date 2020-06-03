import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../index';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon/icon';
import { normalize } from '../../styles/dimensions';
import { IconValues } from '../../components/icon/values';

export interface ICheckboxProps {
    children?: any;
    style?: any;
    text?: string;
    disabled?: boolean;
    checked?: boolean;
    onPress?: any;
    styles: ReturnType<typeof stylesProvider>;
    textStyle?: any;
    testID?: string;
}

export const CheckboxComponent = (props: ICheckboxProps) => (
    <TouchableOpacity
        testID={props?.testID || 'checkbox'}
        disabled={props.disabled}
        onPress={props.onPress}
        style={[props.styles.container, props.style]}
    >
        <Icon
            name={props.checked ? IconValues.CHECK_BOX_THICKED : IconValues.CHECK_BOX}
            size={normalize(18)}
            style={props.styles.icon}
        />
        {props.text && <Text style={[props.styles.text, props.textStyle]}>{props.text}</Text>}
    </TouchableOpacity>
);

export const Checkbox = withTheme(stylesProvider)(CheckboxComponent);
