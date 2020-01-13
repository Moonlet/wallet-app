import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

interface IExternalProps {
    backgroundColor?: string;
    spinnerColor?: string;
}

export class LoadingIndicatorComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;
        const { spinnerColor } = this.props;

        return (
            <View style={[styles.container, { backgroundColor: this.props.backgroundColor }]}>
                <ActivityIndicator
                    size="large"
                    color={spinnerColor ? spinnerColor : theme.colors.accent}
                />
            </View>
        );
    }
}

export const LoadingIndicator = smartConnect<IExternalProps>(LoadingIndicatorComponent, [
    withTheme(stylesProvider)
]);
