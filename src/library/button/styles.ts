import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.accent,
            borderRadius: 6,
            paddingHorizontal: 6
            // flex: 1,
            // flexBasis: 0
        },

        text: {
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
            backgroundColor: theme.colors.disabledButton,
            borderColor: theme.colors.disabledButton
        },

        textDisabled: {
            color: theme.colors.cardBackground
        }
    });
