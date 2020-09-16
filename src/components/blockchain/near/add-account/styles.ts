import { StyleSheet, Platform } from 'react-native';
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
            paddingHorizontal: Platform.select({
                default: BASE_DIMENSION * 4,
                web: BASE_DIMENSION * 2
            })
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
            marginBottom: BASE_DIMENSION * 6,
            color: theme.colors.text
        },
        titleWeb: {
            marginBottom: BASE_DIMENSION * 2
        },
        subtitleWeb: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(21),
            textAlign: 'center',
            color: theme.colors.textSecondary
        },
        recoverButton: {
            marginBottom: BASE_DIMENSION * 3
        }
    });
