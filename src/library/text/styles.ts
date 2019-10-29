import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        default: {
            color: theme.colors.text,
            fontFamily: 'System',
            fontSize: theme.fontSize.regular
        },
        darker: {
            color: theme.colors.textSecondary
        },
        small: {
            fontSize: theme.fontSize.small
        },
        large: {
            fontSize: theme.fontSize.large
        }
    });
