import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    normalize
} from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.bottomSheetBackground,
            padding: BASE_DIMENSION * 2
        },
        scrollContainer: {
            flexGrow: 1,
            backgroundColor: theme.colors.bottomSheetBackground,
            marginBottom: BASE_DIMENSION * 4
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        firstRow: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION / 4,
            width: '100%'
        },
        accountName: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        accountAddress: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.accent,
            flexShrink: 1
        },
        fistAmountText: {
            color: theme.colors.textSecondary,
            marginRight: BASE_DIMENSION
        },
        secondAmountText: {
            color: theme.colors.textSecondary
        },

        // Swipeable left actions
        leftActionsContainer: {
            flexDirection: 'row'
        },
        action: {
            justifyContent: 'center',
            alignItems: 'center',
            width: normalize(72)
        },
        iconActionPositive: {
            height: normalize(40),
            color: theme.colors.accent
        },
        iconActionNegative: {
            height: normalize(40),
            color: theme.colors.error
        },
        textActionPositive: {
            fontSize: normalizeFontAndLineHeight(10),
            color: theme.colors.accent
        },
        textActionNegative: {
            fontSize: normalizeFontAndLineHeight(10),
            color: theme.colors.error
        }
    });
