import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    normalize
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingVertical: BASE_DIMENSION * 5
        },
        header: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            letterSpacing: LETTER_SPACING,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.text,
            textAlign: 'center'
        },
        body: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        },
        button: {
            marginTop: BASE_DIMENSION * 4,
            width: normalize(180),
            alignSelf: 'center'
        }
    });
