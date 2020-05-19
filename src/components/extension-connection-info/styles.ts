import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: '#fc783a',
            width: '100%'
        },
        text: {
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.gradientDark,
            textAlign: 'center'
        }
    });
