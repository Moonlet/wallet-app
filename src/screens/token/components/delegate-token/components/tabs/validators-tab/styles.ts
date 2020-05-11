import { StyleSheet } from 'react-native';
import { BASE_DIMENSION, normalize } from '../../../../../../../styles/dimensions';
import { ITheme } from '../../../../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION,
            marginTop: BASE_DIMENSION * 3
        },
        inputContainer: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION
        },
        text: {
            fontWeight: 'bold',
            fontSize: normalize(22),
            lineHeight: normalize(28),
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2
        },
        bottomContainer: {
            marginTop: BASE_DIMENSION * 3,
            marginHorizontal: BASE_DIMENSION * 4
        }
    });
