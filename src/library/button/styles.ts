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

        textPrimary: {
            color: theme.colors.appBackground
        }
    });
