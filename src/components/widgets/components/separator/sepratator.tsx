import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IExternalProps } from '../../../../library';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';

export const SeparatorComponent: React.FC<IThemeProps<ReturnType<typeof stylesProvider>>> = ({
    styles
}) => {
    return <View style={styles.separator} />;
};

export const Separator = smartConnect<IExternalProps>(SeparatorComponent, [
    withTheme(stylesProvider)
]);
