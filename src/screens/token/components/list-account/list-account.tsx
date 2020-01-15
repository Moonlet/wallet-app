import React from 'react';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { View, Image } from 'react-native';
import Icon from '../../../../components/icon';
import TouchableOpacity from '../../../../library/touchable-opacity/touchable-opacity';

export interface IProps {
    label: string | JSX.Element;
    leftIcon?: number;
    rightIcon?: string;
    selected?: boolean;
    onPress?: any;
    style?: any;
}

export const ListAccountComponent = (
    props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const label =
        typeof props.label === 'string' ? (
            <Text style={props.styles.label}>{props.label}</Text>
        ) : (
            props.label
        );
    return (
        <TouchableOpacity
            style={[props.styles.card, props.selected && props.styles.selected, props.style]}
            onPress={props.onPress}
        >
            {props.leftIcon && (
                <View style={props.styles.iconLeftContainer}>
                    <Image
                        resizeMode="contain"
                        style={props.styles.accountIcon}
                        source={props.leftIcon}
                    />
                </View>
            )}
            <View style={props.styles.labelContainer}>{label}</View>
            {props.rightIcon && (
                <View style={props.styles.iconRightContainer}>
                    <Icon name={props.rightIcon} size={20} style={props.styles.icon} />
                </View>
            )}
        </TouchableOpacity>
    );
};

export const ListAccount = smartConnect<IProps>(ListAccountComponent, [withTheme(stylesProvider)]);
