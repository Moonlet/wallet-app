import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../icon/icon';
import { ICON_SIZE } from '../../styles/dimensions';

export interface IProps {
    testID?: string;
    onPress?: any;
    icon?: string;
    text?: string;
    styles: ReturnType<typeof stylesProvider>;
}

export const HeaderLeftComponent = (props: IProps) => (
    <TouchableOpacity
        testID={props?.testID || 'header-left'}
        onPress={props.onPress}
        style={props.styles.button}
    >
        {props.icon && (
            <View style={props.styles.iconContainer}>
                <Icon name={props.icon} size={ICON_SIZE} style={props.styles.icon} />
            </View>
        )}
        {props.text && <Text style={props.styles.text}>{props.text}</Text>}
    </TouchableOpacity>
);

export const HeaderLeft = withTheme(stylesProvider)(HeaderLeftComponent);
