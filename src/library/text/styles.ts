import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { normalize } from './text';

export default (theme: ITheme) =>
    StyleSheet.create({
        default: {
            color: theme.colors.text,
            fontFamily: 'System',
            fontSize: normalize(theme.fontSize.regular)
        },
        darker: {
            color: theme.colors.textSecondary
        },
        small: {
            fontSize: normalize(theme.fontSize.small)
        },
        large: {
            fontSize: normalize(theme.fontSize.large)
        }
    });
