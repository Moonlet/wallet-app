import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize } from '../../styles/dimensions';
import { SmartImage } from '../../library/image/smart-image';
import { IconValues } from '../icon/values';
import Icon from '../icon/icon';
import { ITokenIcon } from '../../core/blockchain/types/token';
import { Text } from '../../library';

export interface IExternalProps {
    mainText: string | JSX.Element;
    subtitleText?: string | JSX.Element;
    isActive: boolean;
    onPressCheckBox: () => void;
    onLongPress: any;
    imageIcon: ITokenIcon;
    extraData?: {
        networkAvailable?: boolean;
    };
}

export const DraggableCardWithCheckboxComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles, theme } = props;

    let checkBoxIcon = props.isActive ? IconValues.CHECK_BOX_THICKED : IconValues.CHECK_BOX;

    if (props?.extraData?.networkAvailable && props.extraData.networkAvailable !== null) {
        checkBoxIcon =
            props.isActive && props.extraData.networkAvailable
                ? IconValues.CHECK_BOX_THICKED
                : IconValues.CHECK_BOX;
    }

    const mainLabel =
        typeof props.mainText === 'string' ? (
            <Text style={styles.mainText}>{props.mainText}</Text>
        ) : (
            props.mainText
        );

    let subtitleLabel = null;
    if (props?.subtitleText) {
        subtitleLabel =
            typeof props.subtitleText === 'string' ? (
                <Text style={styles.subtitleText}>{props.subtitleText}</Text>
            ) : (
                props.subtitleText
            );
    }

    return (
        <View style={[styles.container, props.isActive && styles.containerActive]}>
            <View style={styles.infoContainer}>
                <SmartImage source={props.imageIcon} style={styles.imageIcon} />
                <View style={styles.textContainer}>
                    {mainLabel}
                    {subtitleLabel}
                </View>
            </View>

            <TouchableOpacity
                style={styles.iconContainer}
                onPressOut={() => props.onPressCheckBox()}
            >
                <Icon
                    size={normalize(18)}
                    name={checkBoxIcon}
                    style={{
                        color: props.isActive ? theme.colors.accent : theme.colors.textSecondary
                    }}
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer} onLongPress={() => props.onLongPress()}>
                <Icon
                    size={normalize(18)}
                    name={IconValues.NAVIGATION_MENU}
                    style={styles.menuIcon}
                />
            </TouchableOpacity>
        </View>
    );
};

export const DraggableCardWithCheckbox = smartConnect<IExternalProps>(
    DraggableCardWithCheckboxComponent,
    [withTheme(stylesProvider)]
);
