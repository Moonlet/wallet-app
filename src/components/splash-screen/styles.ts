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
            height: '100%'
        },
        connectingPhoneContainer: {
            paddingHorizontal: BASE_DIMENSION * 6,
            paddingBottom: BASE_DIMENSION * 4,
            justifyContent: 'center'
        },
        connectingText: {
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 2
        }
    });
