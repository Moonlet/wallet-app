import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    SCREEN_HEIGHT,
    LETTER_SPACING
} from '../../styles/dimensions';
import { pw, ph } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 3,
            justifyContent: 'center',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        logoImage: {
            height: ph(20),
            width: pw(40),
            alignSelf: 'center',
            resizeMode: 'contain'
        },
        textSection: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        launchingSoonText: {
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2
        },
        newSectionText: {
            lineHeight: normalizeFontAndLineHeight(22),
            textAlign: 'center',
            color: theme.colors.textSecondary
        },
        skeletonRow: {
            marginVertical: BASE_DIMENSION
        }
    });
