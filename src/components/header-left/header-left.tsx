import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, normalize } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../icon';
import { ICON_SIZE } from '../../styles/dimensions';

export interface IProps {
    onPress?: any;
    icon?: string;
    text?: string;
    styles: ReturnType<typeof stylesProvider>;
}

export const HeaderLeftComponent = (props: IProps) => (
    <TouchableOpacity onPress={props.onPress} style={props.styles.button}>
        {props.icon && (
            <View style={props.styles.iconContainer}>
                <Icon name={props.icon} size={normalize(ICON_SIZE)} style={props.styles.icon} />
            </View>
        )}
        {props.text && <Text style={props.styles.text}>{props.text}</Text>}
    </TouchableOpacity>
);

export const HeaderLeft = withTheme(stylesProvider)(HeaderLeftComponent);
