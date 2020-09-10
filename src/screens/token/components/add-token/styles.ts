import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    SCREEN_HEIGHT,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingVertical: BASE_DIMENSION * 6,
            paddingHorizontal: BASE_DIMENSION * 2,
            height: SCREEN_HEIGHT
        },
        amountText: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            fontWeight: '500',
            alignSelf: 'center'
        },
        amountConvertedText: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        }
    });
