import React from 'react';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { View, TouchableHighlight } from 'react-native';
import Icon from '../icon/icon';
import { ICON_SIZE, normalize, BASE_DIMENSION } from '../../styles/dimensions';
import { IconValues } from '../icon/values';
import { SmartImage } from '../../library/image/smart-image';

export interface IProps {
    label: string | JSX.Element;
    leftIcon?: IconValues | React.ComponentType<any>;
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
        <TouchableHighlight
            testID={String(props.label)
                .replace(/ /g, '-')
                .toLowerCase()}
            onPress={props.onPress}
            underlayColor={props.theme.colors.appBackground}
        >
            <View style={[props.styles.card, props.selected && props.styles.selected, props.style]}>
                {props.leftIcon ? (
                    props.leftIcon.toString().includes('data:image/') ? (
                        <SmartImage
                            source={{ iconComponent: props.leftIcon as React.ComponentType }}
                            style={{ marginRight: BASE_DIMENSION * 2 }}
                        />
                    ) : (
                        <View style={[props.styles.iconContainer, { alignItems: 'flex-start' }]}>
                            <Icon
                                name={props.leftIcon as string}
                                size={ICON_SIZE}
                                style={props.styles.icon}
                            />
                        </View>
                    )
                ) : null}

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
        </TouchableHighlight>
    );
};

export const ListCard = smartConnect<IProps>(ListCardComponent, [withTheme(stylesProvider)]);
