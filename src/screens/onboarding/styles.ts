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
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION * 4
        },
        buttonsContainer: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: BASE_DIMENSION * 4,
            marginBottom: BASE_DIMENSION * 7
        },
        topButtons: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        button: {
            flex: 1,
            flexBasis: 0
        },
        leftButton: {
            marginRight: BASE_DIMENSION / 2
        },
        rightButton: {
            marginLeft: BASE_DIMENSION / 2
        },
        bottomButton: {
            marginBottom: BASE_DIMENSION * 2,
            width: '100%'
        },
        logoImage: {
            width: pw(60),
            resizeMode: 'contain',
            alignSelf: 'center'
        },
        textContainer: {
            marginHorizontal: BASE_DIMENSION * 4
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
        welcomeText: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            textAlign: 'center',
            color: theme.colors.textSecondary
        }
    });
