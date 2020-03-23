import React from 'react';
import { Text, normalize } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { View, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity onPress={props.onPress}>
            <View style={[props.styles.card, props.selected && props.styles.selected, props.style]}>
                {props.leftIcon && (
                    <View style={[props.styles.iconContainer, { alignItems: 'flex-start' }]}>
                        <Icon name={props.leftIcon} size={ICON_SIZE} style={props.styles.icon} />
                    </View>
                )}

                <View style={props.styles.labelContainer}>{label}</View>

                {props.rightIcon && (
                    <View style={[props.styles.iconContainer, { alignItems: 'flex-end' }]}>
                        <Icon
                            name={props.rightIcon}
                            size={normalize(18)}
                            style={props.styles.icon}
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export const ListCard = smartConnect<IProps>(ListCardComponent, [withTheme(stylesProvider)]);
