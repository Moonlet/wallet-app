import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row'
        },
        icon: {
            color: theme.colors.accent,
            paddingRight: BASE_DIMENSION,
            paddingTop: BASE_DIMENSION / 4
        },
        text: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.textSecondary
        }
    });
