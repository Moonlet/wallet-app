import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        titleStyle: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600',
            color: theme.colors.text
        },
        descriptionStyle: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.textSecondary
        },
        contentContainerStyle: {
            backgroundColor: theme.colors.bottomSheetBackground
        },
        dialogStyle: {
            backgroundColor: theme.colors.bottomSheetBackground,
            borderRadius: BORDER_RADIUS * 2
        },
        cancelButton: {
            paddingHorizontal: BASE_DIMENSION * 2,
            borderWidth: 2,
            borderColor: theme.colors.textTertiary,
            backgroundColor: theme.colors.bottomSheetBackground
        },
        cancelButtonText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary
        },
        confirmButton: {
            paddingHorizontal: BASE_DIMENSION * 2,
            borderWidth: 2,
            borderColor: theme.colors.accentSecondary,
            backgroundColor: theme.colors.bottomSheetBackground
        },
        confirmButtonText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600',
            color: theme.colors.accent
        },
        textInputDefault: {
            paddingHorizontal: BASE_DIMENSION,
            backgroundColor: theme.colors.inputBackground,
            borderRadius: BORDER_RADIUS / 2,
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.text
        },
        textInputIOS: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.bottomSheetBackground
        }
    });
