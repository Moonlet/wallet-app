import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IScreenModule, ISeparatorData } from '../../types';

interface IExternalProps {
    module: IScreenModule;
}

const SeparatorComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { module, styles, theme } = props;
    const data = module.data as ISeparatorData;
    const color = data?.color;

    return (
        <View
            style={[styles.separator, { backgroundColor: color || theme.colors.inputBackground }]}
        />
    );
};

export const Separator = smartConnect<IExternalProps>(SeparatorComponent, [
    withTheme(stylesProvider)
]);
