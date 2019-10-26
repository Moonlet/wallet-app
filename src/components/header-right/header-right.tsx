import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../icon';

export interface IProps {
    onPress?: any;
    icon?: string;
    text?: string;
    styles: ReturnType<typeof stylesProvider>;
}

export const HeaderRightComponent = (props: IProps) => (
    <TouchableOpacity onPress={props.onPress} style={[props.styles.button]}>
        {props.text && <Text>{props.text}</Text>}
        {props.icon && <Icon name={props.icon} size={20} style={props.styles.icon} />}
    </TouchableOpacity>
);

export const HeaderRight = withTheme(stylesProvider)(HeaderRightComponent);
