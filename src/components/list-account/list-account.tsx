import React from 'react';
import { View, Platform, TouchableHighlight } from 'react-native';
import { Text, Button } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import Icon from '../icon/icon';
import { translate } from '../../core/i18n';
import { SmartImage } from '../../library/image/smart-image';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';

export interface IProps {
    testID?: string;
    label: string | JSX.Element;
    leftIcon?: React.ComponentType<any>;
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
        <TouchableHighlight
            testID={props.testID}
            onPress={props.onPress}
            underlayColor={props.theme.colors.bottomSheetBackground}
        >
            <View style={[props.styles.card, props.selected && props.styles.selected, props.style]}>
                {props.leftIcon && !props.isCreate && (
                    <SmartImage
                        source={{ iconComponent: BlockchainIcon }}
                        style={{
                            marginLeft: Platform.select({
                                default: BASE_DIMENSION,
                                web: BASE_DIMENSION / 4
                            }),
                            marginRight: Platform.select({
                                default: BASE_DIMENSION * 2,
                                web: BASE_DIMENSION
                            })
                        }}
                    />
                )}

                <View
                    style={[
                        props.styles.labelContainer,
                        { alignItems: props.isCreate ? 'center' : 'flex-start' }
                    ]}
                >
                    {label}
                </View>

                {props.rightIcon && !props.isCreate && (
                    <View style={props.styles.iconRightContainer}>
                        <Icon
                            name={props.rightIcon}
                            size={normalize(20)}
                            style={props.styles.icon}
                        />
                    </View>
                )}

                {props.isCreate && (
                    <View>
                        <Button style={props.styles.addButton} disabled>
                            {translate('App.labels.add')}
                        </Button>
                    </View>
                )}
            </View>
        </TouchableHighlight>
    );
};

export const ListAccount = smartConnect<IProps>(ListAccountComponent, [withTheme(stylesProvider)]);
