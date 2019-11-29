import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export class LoadingIndicatorComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;

        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
            </View>
        );
    }
}

export const LoadingIndicator = smartConnect(LoadingIndicatorComponent, [
    withTheme(stylesProvider)
]);
