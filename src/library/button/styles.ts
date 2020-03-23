import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION } from '../../styles/dimensions';
import { normalize } from '../text/text';

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
            lineHeight: normalize(22),
            fontWeight: '600',
            textAlign: 'center',
            color: theme.colors.accent
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
        }
    });
