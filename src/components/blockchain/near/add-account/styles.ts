import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../../styles/dimensions';
import { ph, pw } from '../../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION * 4
        },
        moonletImage: {
            height: ph(20),
            width: pw(50),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 6
        },
        title: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 6
        },
        titleWeb: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(21),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        },
        recoverButton: {
            marginBottom: BASE_DIMENSION * 3
        }
    });
