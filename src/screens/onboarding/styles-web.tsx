import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { pw } from '../../styles';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        topContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        bottomContainer: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION * 3,
            marginTop: BASE_DIMENSION * 2
        },
        logoImage: {
            width: pw(60),
            resizeMode: 'contain',
            alignSelf: 'center'
        },
        welcomeTitle: {
            fontSize: normalize(22),
            lineHeight: normalize(28),
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION
        },
        infoRow: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        circle: {
            height: normalize(30),
            width: normalize(30),
            borderRadius: normalize(15),
            backgroundColor: theme.colors.accentSecondary,
            marginRight: BASE_DIMENSION * 2,
            justifyContent: 'center'
        },
        number: {
            fontSize: normalize(17),
            lineHeight: normalize(21),
            textAlign: 'center',
            color: theme.colors.accent
        },
        welcomeTextWeb: {
            fontSize: normalize(16),
            lineHeight: normalize(21),
            textAlign: 'center',
            color: theme.colors.textSecondary,
            paddingHorizontal: BASE_DIMENSION * 4
        },
        text: {
            fontSize: normalize(15),
            lineHeight: normalize(19),
            color: theme.colors.text,
            marginTop: BASE_DIMENSION / 2
        },
        canvas: {
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
        }
    });
