import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column'
        },
        button: {
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.colors.accentSecondary,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION,
            justifyContent: 'center'
        },
        text: {
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        buttonPrimary: {
            backgroundColor: theme.colors.accent,
            borderColor: theme.colors.accent
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
            backgroundColor: theme.colors.disabledButton,
            borderColor: theme.colors.disabledButton
        },
        buttonDisabledSecondary: {
            backgroundColor: theme.colors.appBackground,
            borderColor: theme.colors.textTertiary
        },
        textDisabled: {
            color: theme.colors.cardBackground
        },
        textDisabledSecondary: {
            color: theme.colors.textTertiary
        },
        leftIcon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        leftIconPrimary: {
            color: theme.colors.appBackground,
            alignSelf: 'center'
        },
        bottomLabel: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.text,
            marginTop: BASE_DIMENSION / 2,
            textAlign: 'center'
        }
    });
