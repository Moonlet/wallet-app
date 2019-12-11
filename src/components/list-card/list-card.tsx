import React from 'react';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { View, TouchableHighlight } from 'react-native';
import Icon from '../icon';
import { ICON_SIZE } from '../../styles/dimensions';

export interface IProps {
    label: string | JSX.Element;
    leftIcon?: string;
    rightIcon?: string;
    selected?: boolean;
    onPress?: any;
    style?: any;
}

export const ListCardComponent = (
    props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const label =
        typeof props.label === 'string' ? (
            <Text style={props.styles.label}>{props.label}</Text>
        ) : (
            props.label
        );
    return (
        <TouchableHighlight onPress={props.onPress}>
            <View style={[props.styles.card, props.selected && props.styles.selected, props.style]}>
                {props.leftIcon && (
                    <View style={props.styles.iconLeftContainer}>
                        <Icon name={props.leftIcon} size={ICON_SIZE} style={props.styles.icon} />
                    </View>
                )}
                <View style={props.styles.labelContainer}>{label}</View>
                {props.rightIcon && (
                    <View style={props.styles.iconRightContainer}>
                        <Icon name={props.rightIcon} size={16} style={props.styles.icon} />
                    </View>
                )}
            </View>
        </TouchableHighlight>
    );
};

export const ListCard = smartConnect<IProps>(ListCardComponent, [withTheme(stylesProvider)]);
