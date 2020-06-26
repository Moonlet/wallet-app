import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { Text, Button } from '../../library';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';

export interface IExternalProps {
    title: string;
    middleTitle: string;
    bottomTitle?: string;
    buttonText: string;
    buttonColor: string;
    buttonDisabled?: boolean;
    onPress: () => void;
}

export const PosWidgetComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    let buttonStyle;
    if (props.buttonDisabled) {
        buttonStyle = {};
    } else {
        buttonStyle = {
            backgroundColor: props.buttonColor,
            borderColor: props.buttonColor
        };
    }

    return (
        <View style={props.styles.container}>
            <View style={props.styles.textContainer}>
                <Text style={props.styles.title}>{props.title}</Text>
                <Text style={props.styles.secondaryText}>{props.middleTitle}</Text>
                {props.bottomTitle && (
                    <Text style={props.styles.secondaryText}>{props.bottomTitle}</Text>
                )}
            </View>
            <Button
                primary
                onPress={() => props.onPress()}
                wrapperStyle={props.styles.buttonWrapper}
                style={buttonStyle}
                disabled={props.buttonDisabled}
            >
                {props.buttonText}
            </Button>
        </View>
    );
};

export const PosWidget = smartConnect<IExternalProps>(PosWidgetComponent, [
    withTheme(stylesProvider)
]);
