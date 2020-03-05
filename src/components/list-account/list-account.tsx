import React from 'react';
import { Text, Button } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { View } from 'react-native';
import Icon from '../icon';
import TouchableOpacity from '../../library/touchable-opacity/touchable-opacity';
import { translate } from '../../core/i18n';

export interface IProps {
    label: string | JSX.Element;
    leftIcon?: any;
    rightIcon?: string;
    selected?: boolean;
    onPress?: any;
    style?: any;
    isCreate?: boolean;
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

    const BlockchainIcon = props?.leftIcon;

    return (
        <TouchableOpacity
            style={[props.styles.card, props.selected && props.styles.selected, props.style]}
            onPress={props.onPress}
        >
            {props.leftIcon && (
                <BlockchainIcon width={40} height={40} style={props.styles.iconLeftContainer} />
            )}

            <View style={props.styles.labelContainer}>{label}</View>
            {props.rightIcon && !props.isCreate && (
                <View style={props.styles.iconRightContainer}>
                    <Icon name={props.rightIcon} size={20} style={props.styles.icon} />
                </View>
            )}
            {props.isCreate && (
                <Button style={props.styles.createButton} disabled>
                    {translate('App.labels.create')}
                </Button>
            )}
        </TouchableOpacity>
    );
};

export const ListAccount = smartConnect<IProps>(ListAccountComponent, [withTheme(stylesProvider)]);
