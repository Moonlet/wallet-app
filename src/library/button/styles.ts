import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
            paddingVertical: BASE_DIMENSION + BASE_DIMENSION / 2,
            borderWidth: 2,
            borderColor: theme.colors.accentSecondary,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION
        },
        text: {
            fontSize: 17,
            lineHeight: 22,
            textAlign: 'center',
            color: theme.colors.accent
        },
        buttonPrimary: {
            backgroundColor: theme.colors.accent
        },
        buttonSecondary: {
            borderColor: theme.colors.textSecondary
        },
        textPrimary: {
            color: theme.colors.appBackground
        },
        textSecondary: {
            color: theme.colors.text
        },
        buttonDisabled: {
            backgroundColor: theme.colors.textTertiary,
            borderColor: theme.colors.textTertiary
        },
        textDisabled: {
            color: theme.colors.cardBackground
        }
    });
