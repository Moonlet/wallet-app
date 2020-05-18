import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { normalizeFontAndLineHeight } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        defaultText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.text
        },
        amountText: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.textTertiary
        }
    });
