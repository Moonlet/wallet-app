import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        row: {
            flexDirection: 'row'
        },
        icon: {
            color: theme.colors.accent,
            marginRight: BASE_DIMENSION / 2
        },
        line: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.white
        }
    });
