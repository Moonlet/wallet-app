import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { pw } from '../../styles';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';

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
            paddingHorizontal: BASE_DIMENSION * 4,
            marginBottom: BASE_DIMENSION * 7
        },
        topButtons: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        leftButton: {
            marginRight: BASE_DIMENSION / 2
        },
        rightButton: {
            marginLeft: BASE_DIMENSION / 2
        },
        bottomButton: {
            marginBottom: BASE_DIMENSION * 2
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
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION
        },
        welcomeText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            textAlign: 'center',
            color: theme.colors.textSecondary
        }
    });
