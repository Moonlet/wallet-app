import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';

interface IExternalProps {
    color?: string;
}

const SeparatorComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles, theme } = props;

    return (
        <View
            style={[
                styles.separator,
                { backgroundColor: props?.color ? props.color : theme.colors.inputBackground }
            ]}
        />
    );
};

export const Separator = smartConnect<IExternalProps>(SeparatorComponent, [
    withTheme(stylesProvider)
]);
