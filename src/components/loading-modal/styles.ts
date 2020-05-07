import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize, SCREEN_HEIGHT } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            display: 'flex',
            width: '100%',
            height: SCREEN_HEIGHT,
            backgroundColor: theme.colors.gradientDark,
            opacity: 0.75,
            justifyContent: 'center'
        },
        message: {
            lineHeight: normalize(22),
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION * 4
        }
    });
