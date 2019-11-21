import React from 'react';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { View, TouchableHighlight } from 'react-native';
import Icon from '../icon';

export interface IProps {
    label: string | JSX.Element;
    leftIcon?: string;
    rightIcon?: string;
    selected?: boolean;
    onPress?: any;
}

export const ListCardComponent = (
    props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const label = typeof props.label === 'string' ? <Text>{props.label}</Text> : props.label;
    return (
        <TouchableHighlight onPress={props.onPress}>
            <View style={[props.styles.card, props.selected && props.styles.selected]}>
                {props.leftIcon && (
                    <Icon name={props.leftIcon} size={24} style={props.styles.icon} />
                )}
                <View style={{ flex: 1 }}>{label}</View>
                {props.rightIcon && (
                    <Icon name={props.rightIcon} size={24} style={props.styles.icon} />
                )}
            </View>
        </TouchableHighlight>
    );
};

export const ListCard = smartConnect<IProps>(ListCardComponent, [withTheme(stylesProvider)]);
