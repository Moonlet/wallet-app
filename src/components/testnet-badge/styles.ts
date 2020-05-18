import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { normalize, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            height: normalize(22),
            width: '100%',
            backgroundColor: theme.colors.warning
        },
        text: {
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.gradientDark,
            textAlign: 'center'
        }
    });
