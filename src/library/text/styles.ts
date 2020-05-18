import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        default: {
            color: theme.colors.text,
            fontFamily: 'System',
            fontSize: normalizeFontAndLineHeight(theme.fontSize.regular)
        },
        darker: {
            color: theme.colors.textSecondary
        },
        small: {
            fontSize: normalizeFontAndLineHeight(theme.fontSize.small)
        },
        large: {
            fontSize: normalizeFontAndLineHeight(theme.fontSize.large)
        }
    });
