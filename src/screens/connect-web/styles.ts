import { StyleSheet } from 'react-native';
import {
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    MARGIN_DIMENSION,
    BASE_DIMENSION
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
            marginTop: BASE_DIMENSION * 0.7
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
            marginTop: BASE_DIMENSION * 0.5,
            marginLeft: MARGIN_DIMENSION,
            marginRight: MARGIN_DIMENSION,
            marginBottom: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground,
            borderRadius: BASE_DIMENSION * 0.2,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        },
        connectLedgerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.accent,
            borderRadius: BASE_DIMENSION * 0.2,
            height: BASE_DIMENSION * 2,
            marginHorizontal: MARGIN_DIMENSION
        },
        connectLedgerText: {
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.appBackground,
            marginLeft: 6
        },
        loadingText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            letterSpacing: -0.41,
            color: theme.colors.loadingText,
            opacity: 0.67
        },
        touchableConnect: {
            width: '100%'
        }
    });
