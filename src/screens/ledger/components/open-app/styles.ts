import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    LETTER_SPACING,
    normalize,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 6,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION * 6
        },
        image: {
            width: '100%',
            height: normalize(260)
        },
        primaryText: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION,
            marginTop: BASE_DIMENSION * 2
        },
        secondaryText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 2 + BASE_DIMENSION / 2,
            paddingHorizontal: BASE_DIMENSION
        }
    });
