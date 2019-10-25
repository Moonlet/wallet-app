import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../../library';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../icon';

export interface IProps {
    onPress?: any;
    styles: ReturnType<typeof stylesProvider>;
}

export const GoBackButtonComponent = (props: IProps) => (
    <TouchableOpacity onPress={props.onPress} style={[props.styles.button]}>
        <Icon name="arrow-left-1" size={20} style={props.styles.icon} />
        <Text>Back</Text>
    </TouchableOpacity>
);

export const GoBackButton = withTheme(GoBackButtonComponent, stylesProvider);
