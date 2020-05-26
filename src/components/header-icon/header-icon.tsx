import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Icon } from '../icon/icon';
import { normalize } from '../../styles/dimensions';
import { IconValues } from '../icon/values';

export interface IProps {
    name?: string;
    styles: ReturnType<typeof stylesProvider>;
}

export const HeaderIconComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <Icon
            name={props.name || IconValues.SATURN_ICON}
            size={normalize(28)}
            style={props.styles.icon}
        />
    </View>
);

export const HeaderIcon = withTheme(stylesProvider)(HeaderIconComponent);
