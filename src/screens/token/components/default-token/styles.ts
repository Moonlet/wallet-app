import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { ph, pw } from '../../../../styles';
import {
    BASE_DIMENSION,
    LETTER_SPACING,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION
        },
        scrollContainer: {
            flexGrow: 1,
            paddingTop: BASE_DIMENSION * 5
        },
        balanceContainer: {
            marginTop: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        buttonsContainer: {
            marginTop: BASE_DIMENSION * 8,
            marginBottom: BASE_DIMENSION * 2,
            marginHorizontal: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        button: {
            marginHorizontal: BASE_DIMENSION / 2
        },
        transactionsTitle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            opacity: 0.87,
            fontWeight: 'bold',
            marginLeft: BASE_DIMENSION * 2
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
        },
        emptySectionTitle: {
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION
        },
        emptySectionSubtitle: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textTertiary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        }
    });
