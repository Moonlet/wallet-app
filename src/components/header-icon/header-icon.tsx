import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../icon';
import { normalize } from '../../styles/dimensions';

export interface IProps {
    name?: string;
    styles: ReturnType<typeof stylesProvider>;
}

export const HeaderIconComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <Icon name={props.name || 'saturn-icon'} size={normalize(28)} style={props.styles.icon} />
    </View>
);

export const HeaderIcon = withTheme(stylesProvider)(HeaderIconComponent);
