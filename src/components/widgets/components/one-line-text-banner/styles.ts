import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { normalizeFontAndLineHeight } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row'
        },
        text: {
            fontSize: normalizeFontAndLineHeight(14),
            fontWeight: 'bold',
            color: theme.colors.accent
        }
    });
