import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        titleStyle: {
            fontSize: 17,
            lineHeight: 22,
            fontWeight: '600',
            color: theme.colors.text
        },
        descriptionStyle: {
            fontSize: 13,
            lineHeight: 18,
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
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textSecondary
        },
        confirmButton: {
            paddingHorizontal: BASE_DIMENSION * 2,
            borderWidth: 2,
            borderColor: theme.colors.accentSecondary,
            backgroundColor: theme.colors.bottomSheetBackground
        },
        confirmButtonText: {
            fontSize: 17,
            lineHeight: 22,
            fontWeight: '600',
            color: theme.colors.accent
        },
        textInput: {
            paddingHorizontal: BASE_DIMENSION,
            backgroundColor: theme.colors.inputBackground,
            borderRadius: BORDER_RADIUS / 2,
            fontSize: 11,
            lineHeight: 13,
            color: theme.colors.text
        }
    });
