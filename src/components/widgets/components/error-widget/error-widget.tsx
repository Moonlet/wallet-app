import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Button, Text } from '../../../../library';

interface IExternalProps {
    header: string;
    body: string;
    cta?: {
        label: string;
        onPress: () => void;
    };
}

const ErrorWidgetComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { header, body, cta, styles } = props;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{header}</Text>
            <Text style={styles.body}>{body}</Text>
            {props?.cta && (
                <Button onPress={() => props.cta.onPress()} style={styles.button}>
                    {cta.label}
                </Button>
            )}
        </View>
    );
};

export const ErrorWidget = smartConnect<IExternalProps>(ErrorWidgetComponent, [
    withTheme(stylesProvider)
]);
