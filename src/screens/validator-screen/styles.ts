import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ph, pw } from '../../styles';
import {
    SCREEN_HEIGHT,
    BASE_DIMENSION,
    normalize,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT,
            paddingVertical: BASE_DIMENSION * 5,
            paddingHorizontal: BASE_DIMENSION * 3
        },
        topContainer: {
            flexDirection: 'column',
            marginBottom: BASE_DIMENSION * 3,
            alignItems: 'center'
        },
        topText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        title: {
            fontSize: normalizeFontAndLineHeight(30),
            lineHeight: normalizeFontAndLineHeight(41),
            color: theme.colors.white,
            letterSpacing: LETTER_SPACING,
            marginVertical: BASE_DIMENSION,
            textAlign: 'center'
        },
        token: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.white
        },
        subTitle: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.text,
            textAlign: 'center'
        },
        bottomContainer: {
            marginHorizontal: BASE_DIMENSION
        },
        addressNoExistContainer: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT,
            justifyContent: 'center'
        },
        logoImage: {
            height: ph(20),
            width: pw(50),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 2
        },

        // navigation
        navigationImage: {
            height: normalize(36),
            width: normalize(36),
            borderRadius: normalize(36),
            marginRight: BASE_DIMENSION * 2,
            alignSelf: 'center'
        },
        labelName: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.white,
            textAlign: 'center'
        },
        website: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        }
    });
