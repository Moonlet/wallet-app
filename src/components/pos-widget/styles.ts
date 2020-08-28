import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    normalize
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION * 2,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION
        },
        textContainer: {
            flex: 1,
            flexDirection: 'column',
            paddingRight: BASE_DIMENSION * 2
        },
        title: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(25),
            color: theme.colors.text,
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            marginBottom: BASE_DIMENSION / 2
        },
        secondaryText: {
            fontSize: normalizeFontAndLineHeight(14),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        buttonWrapper: {
            width: normalize(120),
            alignSelf: 'center'
        }
    });
