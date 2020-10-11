import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

interface IExternalProps {
    backgroundColor?: string;
    spinnerColor?: string;
}

export const LoadingIndicatorComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View
            style={[
                props.styles.container,
                { backgroundColor: props?.backgroundColor || props.theme.colors.appBackground }
            ]}
        >
            <ActivityIndicator
                size="large"
                color={props.spinnerColor ? props.spinnerColor : props.theme.colors.accent}
            />
        </View>
    );
};

export const LoadingIndicator = smartConnect<IExternalProps>(LoadingIndicatorComponent, [
    withTheme(stylesProvider)
]);
