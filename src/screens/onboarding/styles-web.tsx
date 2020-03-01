import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { pw } from '../../styles';
import { BASE_DIMENSION } from '../../styles/dimensions';

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
            fontSize: 22,
            lineHeight: 28,
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
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: theme.colors.accentSecondary,
            marginRight: BASE_DIMENSION * 2
        },
        number: {
            fontSize: 17,
            lineHeight: 21,
            textAlign: 'center',
            color: theme.colors.accent,
            alignSelf: 'center',
            marginTop: BASE_DIMENSION / 2
        },
        welcomeTextWeb: {
            fontSize: 16,
            lineHeight: 21,
            textAlign: 'center',
            color: theme.colors.textSecondary,
            paddingHorizontal: BASE_DIMENSION * 4
        },
        text: {
            fontSize: 15,
            lineHeight: 19,
            color: theme.colors.text,
            marginTop: BASE_DIMENSION / 2
        },
        canvas: {
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
        }
    });
