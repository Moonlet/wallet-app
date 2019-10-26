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

export const HeaderLeftComponent = (props: IProps) => (
    <TouchableOpacity onPress={props.onPress} style={[props.styles.button]}>
        {props.icon && <Icon name={props.icon} size={20} style={props.styles.icon} />}
        {props.text && <Text>{props.text}</Text>}
    </TouchableOpacity>
);

export const HeaderLeft = withTheme(stylesProvider)(HeaderLeftComponent);
