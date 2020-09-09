import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../../../../../styles/dimensions';
import { ITheme } from '../../../../../../../core/theme/itheme';
import { ph, pw } from '../../../../../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION,
            marginTop: BASE_DIMENSION * 3,
            paddingBottom: BASE_DIMENSION * 5
        },
        inputContainer: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION
        },
        bottomContainer: {
            marginTop: BASE_DIMENSION * 3,
            marginHorizontal: BASE_DIMENSION * 2
        },
        text: {
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2
        },
        emptySection: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        logoImage: {
            height: ph(20),
            width: pw(50),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 2
        }
    });
