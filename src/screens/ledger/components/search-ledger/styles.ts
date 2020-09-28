import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    LETTER_SPACING,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 6,
            paddingHorizontal: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 4
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
            marginBottom: BASE_DIMENSION * 2
        },
        loadingContainer: {
            flex: 1
        },
        noteText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textTertiary
        },
        cardText: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.textSecondary
        }
    });
