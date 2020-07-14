import { StyleSheet } from 'react-native';
import {
    // SCREEN_HEIGHT,
    // BASE_DIMENSION,
    // normalize,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.webAppBackground
        },
        topContainer: {
            flexDirection: 'column',
            marginTop: 20
        },
        topText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        },
        title: {
            fontSize: normalizeFontAndLineHeight(30),
            lineHeight: normalizeFontAndLineHeight(41),
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center'
        },
        subTitle: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        },
        connectLedgerContainer: {
            marginTop: 14,
            marginLeft: '16.84%',
            marginRight: '16.84%',
            marginBottom: 25,
            backgroundColor: theme.colors.appBackground,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        },
        connectLedgerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.accent,
            borderRadius: 8,
            height: 50,
            marginHorizontal: '27.175%'
        },
        connectLedgerText: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 22,
            lineHeight: 28,
            color: theme.colors.appBackground,
            marginLeft: 6
        }
    });
