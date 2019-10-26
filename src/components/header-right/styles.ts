import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
            flexDirection: 'row',
            marginRight: 16
        },

        icon: {
            color: theme.colors.accent,
            marginHorizontal: 6
        }
    });
