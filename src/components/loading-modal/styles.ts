import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.gradientDark + 'BF', // 75%
            justifyContent: 'center'
        },
        message: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION * 4
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
