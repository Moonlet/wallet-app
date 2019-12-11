import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.appBackground,
            height: '100%'
        },
        lottieWrapper: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION * 6
        },
        lottie: {
            ...StyleSheet.absoluteFillObject,
            height: '100%',
            top: -BASE_DIMENSION * 10
        }
    });
