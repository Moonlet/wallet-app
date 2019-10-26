import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
            paddingHorizontal: 6,
            flexDirection: 'row'
        },

        icon: {
            color: theme.colors.accent,
            marginHorizontal: 6
        }
    });
