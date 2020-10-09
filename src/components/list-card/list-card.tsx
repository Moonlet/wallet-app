import React from 'react';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { View, TouchableHighlight } from 'react-native';
import Icon from '../icon/icon';
import { ICON_SIZE, normalize } from '../../styles/dimensions';

interface IExternalProps {
    label: string | JSX.Element;
    leftIcon?: string;
    rightIcon?: string;
    selected?: boolean;
    onPress?: any;
    style?: any;
    disabled?: {
        value: boolean;
        message?: string;
    };
}

export const ListCardComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;

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
            disabled={props?.disabled?.value}
        >
            <View
                style={[
                    styles.card,
                    props.selected && styles.selected,
                    props.style,
                    props?.disabled?.value === true && styles.cardDisabled
                ]}
            >
                {props.leftIcon && (
                    <View style={[styles.iconContainer, { alignItems: 'flex-start' }]}>
                        <Icon name={props.leftIcon} size={ICON_SIZE} style={styles.icon} />
                    </View>
                )}

                <View style={styles.labelContainer}>
                    {label}
                    {props?.disabled?.message && (
                        <Text style={styles.disabledMessage}>{props.disabled.message}</Text>
                    )}
                </View>

                {props.rightIcon && (
                    <View style={[styles.iconContainer, { alignItems: 'flex-end' }]}>
                        <Icon name={props.rightIcon} size={normalize(18)} style={styles.icon} />
                    </View>
                )}
            </View>
        </TouchableHighlight>
    );
};

export const ListCard = smartConnect<IExternalProps>(ListCardComponent, [
    withTheme(stylesProvider)
]);
