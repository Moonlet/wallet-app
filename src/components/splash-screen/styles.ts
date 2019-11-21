import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.appBackground
        },
        lottieWrapper: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION * 6
        },
        lottie: {
            marginBottom: 150
        }
    });
