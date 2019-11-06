import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            flex: 1,
            width: '100%'
        },

        icon: {
            color: theme.colors.accent,
            paddingRight: 8
        }
    });
