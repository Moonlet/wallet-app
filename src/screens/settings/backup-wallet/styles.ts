import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../styles/dimensions';
import { ph, pw } from '../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground,
            justifyContent: 'center'
        },
        logoImage: {
            height: ph(20),
            width: pw(40),
            alignSelf: 'center',
            resizeMode: 'contain'
        },
        launchingSoonText: {
            fontWeight: 'bold',
            fontSize: normalize(22),
            lineHeight: normalize(28),
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION
        },
        workInProgress: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        }
    });
