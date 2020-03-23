import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION } from '../../styles/dimensions';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        titleStyle: {
            lineHeight: normalize(22),
            fontWeight: '600',
            color: theme.colors.text
        },
        descriptionStyle: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.textSecondary,
            textAlign: 'center'
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
            lineHeight: normalize(22),
            color: theme.colors.textSecondary
        },
        confirmButton: {
            paddingHorizontal: BASE_DIMENSION * 2,
            borderWidth: 2,
            borderColor: theme.colors.accentSecondary,
            backgroundColor: theme.colors.bottomSheetBackground
        },
        confirmButtonText: {
            lineHeight: normalize(22),
            fontWeight: '600',
            color: theme.colors.accent
        },
        textInput: {
            paddingHorizontal: BASE_DIMENSION,
            backgroundColor: theme.colors.inputBackground,
            borderRadius: BORDER_RADIUS / 2,
            fontSize: normalize(11),
            lineHeight: normalize(13),
            color: theme.colors.text
        },
        dialogContainer: {}
    });
